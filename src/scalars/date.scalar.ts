import { GraphQLScalarType } from 'graphql';
import { Kind, ValueNode } from 'graphql';

export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description:
    'Convert Date to number for transmission among client and server',

  parseValue(value: number): Date {
    return new Date(value);
  },

  serialize(value: Date): number {
    return value.getTime();
  },

  parseLiteral(valueNode: ValueNode): Date {
    if (valueNode.kind === Kind.INT) {
      return new Date(parseInt(valueNode.value, 10));
    }
    return null;
  },
});
