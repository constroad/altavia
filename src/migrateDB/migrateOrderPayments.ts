
//npx ts-node src/migrateDB/migrateOrderPayments.ts
const migrateOrderPayments = async () => {
  const connectToMongoDB = require('./db');
  const Order = require('./../models/order').default;
  const Dispatch = require('./../models/dispatch').default;
  await connectToMongoDB();

  const orders = await Order.find({});
  const dispatches = await Dispatch.find({});

  for (const order of orders) {
    order.payments = [{
      date: order.fechaProgramacion,
      amount: order.montoAdelanto,
      note: ''
    }]
    let invoice = ''
    //@ts-ignore
    const [dispatch] = dispatches.filter((x) => x.orderId?.toString() === order._id?.toString() && x.invoice.length > 0)
    if (dispatch) {
      invoice = dispatch.invoice
    }
    order.invoice = invoice
    const updated = await order.save();
    console.log('migrating:', `orderId: ${order._id}`);
    // console.log('updated', updated)
  }

  console.log('Migration completed!');
  process.exit();
};

migrateOrderPayments().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
