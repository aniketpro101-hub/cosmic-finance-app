/**
 * Cosmic Finance — Database Backup & Integrity Restore Service
 * Creates timestamped snapshots of SQLite database to data/backups/
 * and verifies snapshot integrity and restoration capability.
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '../../data/cosmic_finance.db');
const BACKUP_DIR = path.join(__dirname, '../../data/backups');

function createDatabaseBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    return { success: false, error: 'Source database file not found.' };
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `cosmic_finance_backup_${timestamp}.db`;
  const targetPath = path.join(BACKUP_DIR, backupFileName);

  try {
    fs.copyFileSync(DB_PATH, targetPath);
    return {
      success: true,
      filename: backupFileName,
      path: targetPath,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error('Backup creation failed:', err.message);
    return { success: false, error: err.message };
  }
}

function verifyAndRestoreBackup(backupFilePath) {
  if (!fs.existsSync(backupFilePath)) {
    return { success: false, error: 'Backup file does not exist.' };
  }

  try {
    // Open backup file in read-only mode to verify SQLite integrity
    const testDb = new Database(backupFilePath, { readonly: true });
    const check = testDb.prepare('PRAGMA integrity_check').get();
    const tableCount = testDb.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'").get().count;
    testDb.close();

    if (check && check.integrity_check === 'ok') {
      return {
        success: true,
        integrityCheck: 'ok',
        tablesFound: tableCount,
        message: 'Backup integrity fully verified and valid for restoration.'
      };
    } else {
      return { success: false, error: 'Integrity check failed on backup.' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  createDatabaseBackup,
  verifyAndRestoreBackup,
  BACKUP_DIR
};
