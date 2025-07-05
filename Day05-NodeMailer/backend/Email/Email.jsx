import * as React from 'react';
import { Html, Button, Text, Head } from '@react-email/components';

export function Email({ url }) {
  return (
    <Html lang="en">
      <Head />
      <Text>Click the button below:</Text>
      <Button href={url}>Click Me</Button>
    </Html>
  );
}
