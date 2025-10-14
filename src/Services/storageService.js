import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'forms.db', location: 'default' });

// Initialize DB and create table if not exists
export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS forms (
        id TEXT PRIMARY KEY NOT NULL,
        formId TEXT,
        data TEXT,
        date TEXT
      )`,
      [],
      () => console.log('Table created or existed'),
      (tx, error) => console.error('Table creation error:', error),
    );
  });
};

export const saveForm = (formData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO forms (id, formId, data, date) VALUES (?, ?, ?, ?)',
        [formData.id, formData.formId, JSON.stringify(formData.data), formData.date],
        (tx, results) => {
          if (results.rowsAffected > 0) resolve(true);
          else resolve(false);
        },
        (tx, error) => reject(error)
      );
    });
  });
};


// Get all submitted forms
export const getSubmittedForms = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM forms',
        [],
        (tx, results) => {
          const rows = [];
          for (let i = 0; i < results.rows.length; i++) {
            // Parse JSON to restore data object
            const row = results.rows.item(i);
            try {
              row.data = JSON.parse(row.data);
            } catch {
              row.data = {};
            }
            rows.push(row);
          }
          resolve(rows);
        },
        (tx, error) => reject(error)
      );
    });
  });
};

// Delete form by id, then return updated list
export const deleteSubmittedForm = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM forms WHERE id = ?',
        [id],
        async (tx, results) => {
          if (results.rowsAffected > 0) {
            try {
              const updatedForms = await getSubmittedForms();
              resolve(updatedForms);
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error('No rows deleted'));
          }
        },
        (tx, error) => reject(error)
      );
    });
  });
};
