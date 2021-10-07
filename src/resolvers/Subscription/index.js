const counter = {
  subscribe: (root, args, context, info) => {
    console.log(context)
    const channel = Math.random().toString(36).substring(2, 15) // random channel name
    let count = 0
    setInterval(() => context.pubsub.publish(channel, { counter: { count: count, countStr: `${count++}` } }), 2000)
    return context.pubsub.asyncIterator(channel)
  },
}

module.exports = {
  counter,
}