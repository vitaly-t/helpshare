const db = require('./db');

const createMember = (doer, member) => {
  db.getStatusName(doer)
  .then(statusName => {
    if (statusName === 'manager') {
      db.one(
        `
          INSERT INTO member (fullname, handle, phase, status)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [member.fullname, member.handle, member.phase, member.status]
      )
      .then(idRow => {
        logCreation(doer, 'member', idRow.id, member, [
          'fullname', 'handle', 'phase', 'status'
        ]);
      })
      .catch(error => error);
    }
    else {
      throw new Error('createMember');
    }
  })
  .catch(error => error);
};

const createPhase = (doer, phase) => {
  db.getStatusName(doer)
  .then(statusName => {
    if (statusName === 'manager') {
      db.one(
        `INSERT INTO phase (description) VALUES ($1) RETURNING id`,
        [phase.description]
      )
      .then(idRow => {
        logCreation(doer, 'phase', idRow.id, phase, ['description']);
      })
      .catch(error => error);
    }
    else {
      throw new Error('createPhase');
    }
  })
  .catch(error => error);
};

const createStatus = (doer, status) => {
  db.getStatusName(doer)
  .then(statusName => {
    if (statusName === 'manager') {
      db.one(
        `INSERT INTO status (description) VALUES ($1) RETURNING id`,
        [status.description]
      )
      .then(idRow => {
        logCreation(doer, 'status', idRow.id, status, ['description']);
      })
      .catch(error => error);
    }
    else {
      throw new Error('createStatus');
    }
  })
  .catch(error => error);
};

  return db.query(`
    INSERT INTO
      contact (first_name, last_name)
    VALUES
      ($1::text, $2::text)
    RETURNING
      *
    `,
    [
      contact.first_name,
      contact.last_name,
    ])
  .catch(error => error);
};

const getContacts = function() {
  return db.query(`
    SELECT
      *
    FROM
      contact
    `, [])
  .catch(error => error);
};

const getContact = function(contactId) {
  return db.one(`
    SELECT * FROM contact WHERE id=$1::int LIMIT 1
    `,
    [contactId])
  .catch(error => error);
};

const deleteContact = function(contactId) {
  return db.query(`
    DELETE FROM
      contact
    WHERE
      id=$1::int
    `,
    [contactId])
  .catch(error => error);
};

const searchForContact = function(searchQuery) {
  return db.query(`
    SELECT
      *
    FROM
      contact
    WHERE
      lower(first_name || ' ' || last_name) LIKE $1::text
    `,
    [`%${searchQuery.toLowerCase().replace(/\s+/,'%')}%`])
  .catch(error => error);
};

module.exports = {
  createContact,
  getContacts,
  getContact,
  deleteContact,
  searchForContact
};