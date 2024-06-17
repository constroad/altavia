const connectToMongoDB = require('./db');
const Dispatch = require('./../models/dispatch').default;

const migrateDates = async () => {
  await connectToMongoDB();

  const dispatches = await Dispatch.find({});
  console.log('dispatches:', dispatches);

  for (const dispatch of dispatches) {
    //@ts-ignore
    console.log('migrating:', `dispatchId: ${dispatch._id} - ${dispatch.date}`);
    //@ts-ignore
    let dispatchDate = new Date(dispatch.date)
    // if (typeof dispatch.date === "string") {
    //   dispatchDate = new Date(dispatch.date as string);
    // } else {
    //   dispatchDate = dispatch.date
    // }
 
    console.log('dispatchDate', dispatchDate);

    const now = new Date();
    dispatchDate.setHours(now.getHours());
    dispatchDate.setMinutes(now.getMinutes());
    dispatchDate.setSeconds(now.getSeconds());
    dispatchDate.setMilliseconds(now.getMilliseconds());
    dispatch.date = dispatchDate;
    const updated = await dispatch.save();
    console.log('updated', updated)
    // }
  }

  console.log('Migration completed!');
  process.exit();
};

migrateDates().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
