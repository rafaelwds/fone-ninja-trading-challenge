import type { ReactNode } from 'react';
import styled from 'styled-components/native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <Row>
      <ThemedText variant="small">{title}</ThemedText>
      <CodeSnippet surface="backgroundSelected">
        <ThemedText themeColor="textSecondary">{hint}</ThemedText>
      </CodeSnippet>
    </Row>
  );
}

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const CodeSnippet = styled(ThemedView)`
  border-radius: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xxs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
`;
