
const migrateIsPaidOrder = async () => {
  const connectToMongoDB = require('./db');
  const Order = require('./../models/order').default;
  await connectToMongoDB();

  const orders = await Order.find({});
  console.log('orders:', orders);

  for (const order of orders) {
    if (order.isCredit === undefined) {
      order.isCredit = false
    }
    if (order.isPaid) {
      order.isPaid = order.isPaid;
    } else {
      order.isPaid = false;
    }
    const updated = await order.save();
    console.log('migrating:', `orderId: ${order._id}`);
    // console.log('updated', updated)
  }

  console.log('Migration completed!');
  process.exit();
};

migrateIsPaidOrder().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
