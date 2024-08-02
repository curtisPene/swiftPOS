const mongoose = require("mongoose");

const performTransaction = async (operations) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const operation of operations) {
      await operation(session);
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = performTransaction;
