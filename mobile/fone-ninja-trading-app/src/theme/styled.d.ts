import 'styled-components/native';

import type { AppTheme } from './themes';

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
