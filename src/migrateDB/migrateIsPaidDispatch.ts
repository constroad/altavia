
const migrateIsPaidDispatch = async () => {
  const connectToMongoDB = require('./db');
  const Dispatch = require('./../models/dispatch').default;
  await connectToMongoDB();

  const dispatches = await Dispatch.find({});
  console.log('dispatches:', dispatches);

  for (const dispatch of dispatches) {
    //@ts-ignore
    console.log('migrating:', `dispatchId: ${dispatch._id}`);
    //@ts-ignore
    dispatch.isPaid = false;
    const updated = await dispatch.save();
    // console.log('updated', updated)
  }

  console.log('Migration completed!');
  process.exit();
};

migrateIsPaidDispatch().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
