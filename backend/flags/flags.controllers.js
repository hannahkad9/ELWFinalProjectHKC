import { flagModel } from './flags.model.js';

export async function createFlag(req, res) {
  try {
    const { name, country, flag } = req.body; // flag will be a URL or base64 string

    if (!name || !country || !flag) {
      return res.status(400).json({ message: 'Name, country, and flag image are required.' });
    }

    // Determine the next sequential ID
    const currentCount = await flagModel.countDocuments();
    const newId = currentCount + 1;

    const newFlag = new flagModel({
      id: newId,
      name,
      country,
      flag, // Store the image URL or base64 string
    });

    await newFlag.save();
    res.status(201).json(newFlag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getFlags(req, res) {
  try {
    const flags = await flagModel.find({});
    res.json(flags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getFlagById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const flag = await flagModel.findOne({ id });

    if (!flag) {
      return res.status(404).json({ message: 'Flag not found.' });
    }

    res.json(flag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
