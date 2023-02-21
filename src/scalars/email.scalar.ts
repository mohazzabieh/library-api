import { GraphQLScalarType } from 'graphql';
import { Kind, ValueNode } from 'graphql';

const validateEmail = (input: string) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
    return true;
  }

  throw Error('Inavlid Email Address');
};

export const EmailScalar = new GraphQLScalarType({
  name: 'Email',
  description: 'Validate Entry by checking vs standard email format',

  parseValue(value: string) {
    if (!value) return null;

    if (validateEmail(value)) {
      return value;
    }
  },

  serialize(value: string | null) {
    return value ? value.trim() : null;
  },

  parseLiteral(valueNode: ValueNode) {
    if (valueNode.kind === Kind.STRING && validateEmail(valueNode.value)) {
      return valueNode.value;
    }
    return null;
  },
});
