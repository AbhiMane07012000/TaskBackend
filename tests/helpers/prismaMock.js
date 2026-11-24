const models = {};
const prismaModels = new Set([
  "user",
  "task",
  "project",
  "projectUser",
  "taskUser",
  "comment",
  "notification",
  "plan",
  "subscription",
]);

module.exports = new Proxy(models, {
  get(target, modelName) {
    if (!prismaModels.has(modelName)) {
      throw new Error(`Unknown Prisma model: ${String(modelName)}`);
    }

    if (!Object.prototype.hasOwnProperty.call(target, modelName)) {
      target[modelName] = new Proxy(
        {},
        {
          get(model, methodName) {
            if (!Object.prototype.hasOwnProperty.call(model, methodName)) {
              model[methodName] = jest.fn();
            }
            return model[methodName];
          },
        },
      );
    }

    return target[modelName];
  },
});
