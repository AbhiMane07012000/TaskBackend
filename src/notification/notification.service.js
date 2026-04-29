const prisma = require('../../config/db');


// Create a new notification which is called from various places in the codebase when certain events happen (e.g. user added to project, task assigned, etc.)
async function createNotification(userId, type, message) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      message,
    },
  });
}

module.exports = {
  createNotification,
};