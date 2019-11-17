const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Contact = require('../models/Contacts');

//@route   GET api/contacts
//@desc    Get all users contacts
//@access  Private

router.get('/', auth, async (req, res) => {
  try {
    // get latest contact list with specific user
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route   POST api/contacts
//@desc    Add new contacts
//@access  Private

router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route   PUT api/contacts
//@desc    Update contact
//@access  Private

router.put(
  '/:id',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, email, name, phone, type, user, id } = req.body;

    // Build profile object

    const contactFields = {};

    contactFields.user = req.user.id;
    if (email) contactFields.email = email;
    if (name) contactFields.name = name;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    try {
      let user = Contact.findOne({ _id: req.params.id });
      if (user) {
        // Update
        contactUpdate = await Contact.findOneAndUpdate(
          { _id: req.params.id },
          { $set: contactFields },
          { new: true }
        );
        return res.json(contactUpdate);
      }
    } catch (error) {
      console.error(error.message);
      res.send(500).send('Server Error');
    }

    //res.send('Update Contact');
    res.send(req.body);
  }
);

//@route   Delete api/contacts
//@desc    Delete contact
//@access  Private

router.delete('/:id', auth, async (req, res) => {
  try {
    Contact.findOneAndRemove({ _id: req.params.id }).then(() =>
      res.json({ msg: 'Deleted Contact' })
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
  //res.send('Delete Contact');
});

module.exports = router;
