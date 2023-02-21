import { GraphQLScalarType } from 'graphql';
import { Kind, ValueNode } from 'graphql';
import { ObjectId } from 'mongodb';

export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'MongoDb ObjectId',

  parseValue(value: string) {
    if (!value) return null;

    return new ObjectId(value);
  },

  serialize(value: string | null) {
    return value ? value.toString() : null;
  },

  parseLiteral(valueNode: ValueNode) {
    if (valueNode.kind === Kind.STRING) {
      return new ObjectId(valueNode.value);
    }
    return null;
  },
});
