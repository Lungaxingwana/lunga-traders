import sharp from 'sharp';
import { gridFSBucket } from '../libs/db.js';

export async function uploadImage(req, res) {
    const image = req.file;
    if (!image) {
        if (req.internalCall) return { imageId: null };
        return res.status(400).json({ error: 'No image provided' });
    }
    if (!gridFSBucket) {
        if (req.internalCall) return { imageId: null };
        return res.status(500).json({ error: 'GridFS not initialized' });
    }

    try {
        // Resize image if needed
        let buffer = image.buffer;
        let metadata;
        try {
            metadata = await sharp(buffer).metadata();
        } catch (metaErr) {
            if (req.internalCall) return { imageId: null };
            return res.status(400).json({ error: 'Invalid image file', details: metaErr.message });
        }
        if (metadata.width > 600 || metadata.height > 600) {
            try {
                buffer = await sharp(buffer).resize(600, 600, { fit: 'inside' }).toBuffer();
            } catch (resizeErr) {
                if (req.internalCall) return { imageId: null };
                return res.status(400).json({ error: 'Image resize failed', details: resizeErr.message });
            }
        }

        return await new Promise((resolve, reject) => {
            const uploadStream = gridFSBucket.openUploadStream(image.originalname, {
                metadata: { uploadedAt: new Date() }
            });
            uploadStream.end(buffer);

            uploadStream.on('finish', async () => {
                try {
                    const fileId = uploadStream.id || null;
                    if (req.internalCall) {
                        resolve({ imageId: fileId });
                    } else {
                        res.status(200).json({ message: 'Image uploaded successfully', imageId: fileId });
                        resolve();
                    }
                } catch {
                    if (req.internalCall) {
                        resolve({ imageId: null });
                    } else {
                        res.status(200).json({ message: 'Image uploaded successfully', imageId: null });
                        resolve();
                    }
                }
            });

            uploadStream.on('error', (err) => {
                if (req.internalCall) {
                    resolve({ imageId: null });
                } else {
                    res.status(500).json({ error: 'Update failed', details: err.message });
                    resolve();
                }
            });
        });
    } catch (err) {
        if (req.internalCall) return { imageId: null };
        res.status(500).json({ error: 'Server error', details: err.message });
    }
}

export async function getImage(req, res) {
    const fileId = req.params._id;
    if (!gridFSBucket) {
        return res.status(500).json({ error: 'GridFS not initialized' });
    }
    // Use ObjectId from mongodb package
    let ObjectId;
    try {
        ObjectId = (await import('mongodb')).ObjectId;
    } catch {
        return res.status(500).json({ error: 'Cannot load ObjectId from mongodb' });
    }
    try {
        const files = await gridFSBucket.find({ _id: new ObjectId(fileId) }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }
        const file = files[0];
        res.set('Content-Type', file.contentType || 'image/jpeg');
        res.set('Content-Disposition', `inline; filename="${file.filename}"`);
        const downloadStream = gridFSBucket.openDownloadStream(file._id);
        downloadStream.pipe(res);
        downloadStream.on('error', () => {
            res.status(404).json({ error: 'Image not found' });
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error', details: e.message });
    }
}

export async function updateImage(req, res) {
    const fileId = req.params._id;
    const image = req.file;
    if (!image) {
        return res.status(400).json({ error: 'No image provided' });
    }
    if (!gridFSBucket) {
        return res.status(500).json({ error: 'GridFS not initialized' });
    }

    // Use ObjectId from mongodb package
    let ObjectId;
    try {
        ObjectId = (await import('mongodb')).ObjectId;
    } catch {
        return res.status(500).json({ error: 'Cannot load ObjectId from mongodb' });
    }

    let buffer = image.buffer;
    let metadata;
    try {
        metadata = await sharp(buffer).metadata();
    } catch (metaErr) {
        return res.status(400).json({ error: 'Invalid image file', details: metaErr.message });
    }
    if (metadata.width > 600 || metadata.height > 600) {
        try {
            buffer = await sharp(buffer).resize(600, 600, { fit: 'inside' }).toBuffer();
        } catch (resizeErr) {
            return res.status(400).json({ error: 'Image resize failed', details: resizeErr.message });
        }
    }

    // Try to delete the old image, but don't fail if it doesn't exist
    try {
        await gridFSBucket.delete(new ObjectId(fileId));
    } catch (deleteErr) {
        // Only fail if error is not "FileNotFound"
        if (
            deleteErr.code !== 'ENOENT' &&
            (!deleteErr.message || deleteErr.message.indexOf('FileNotFound') === -1)
        ) {
            return res.status(500).json({ error: 'Failed to delete old image', details: deleteErr.message });
        }
    }

    try {
        const uploadStream = gridFSBucket.openUploadStream(image.originalname, {
            metadata: { uploadedAt: new Date() }
        });
        uploadStream.end(buffer);

        uploadStream.on('finish', () => {
            gridFSBucket.find({ filename: image.originalname })
                .sort({ uploadDate: -1 })
                .limit(1)
                .toArray()
                .then(files => {
                    const newFileId = files.length ? files[0]._id : null;
                    res.status(200).json({
                        message: 'Image updated',
                        imageId: newFileId
                    });
                })
                .catch(() => {
                    res.status(200).json({
                        message: 'Image updated',
                        imageId: null
                    });
                });
        });

        uploadStream.on('error', (err) => {
            res.status(500).json({ error: 'Update failed', details: err.message });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
}

export async function deleteImage(req, res) {
    const fileId = req.params._id;
    if (!gridFSBucket) {
        if (req.internalCall) return { deleted: false };
        return res.status(500).json({ error: 'GridFS not initialized' });
    }
    // Use ObjectId from mongodb package
    let ObjectId;
    try {
        ObjectId = (await import('mongodb')).ObjectId;
    } catch {
        if (req.internalCall) return { deleted: false };
        return res.status(500).json({ error: 'Cannot load ObjectId from mongodb' });
    }
    try {
        await gridFSBucket.delete(new ObjectId(fileId));
        if (req.internalCall) return { deleted: true };
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (e) {
        // Defensive: never crash, always respond
        console.error("Error deleting image from GridFS", e);
        if (req.internalCall) return { deleted: false };
        if (!res.headersSent) {
            res.status(500).json({ error: 'Server error', details: e.message });
        }
    }
}

export async function getAllImages(req, res) {
    if (!gridFSBucket) {
        return res.status(500).json({ error: 'GridFS not initialized' });
    }
    try {
        const files = await gridFSBucket.find().toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'No images found' });
        }
        res.status(200).json(files);
    } catch (e) {
        res.status(500).json({ error: 'Server error', details: e.message });
    }
}