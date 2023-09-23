

import { isAllLowerCase } from '../validators';

export class StylePropsUtils {

    static convertNativeStylePropObjectString(stylePropObject: Record<string, unknown>): string {
      return stylePropObject ? Object
        .entries(stylePropObject)
        .map(([key, value]) => `${key}: ${value}`).join(';') : ''
    }
  
    static convertStylePropObjectToNativeStylePropObject(stylePropObject: Record<string, unknown>): Record<string, unknown> {
      return Object
        .entries(stylePropObject)
        .map<[string, unknown]>(([name, value]) => 
            [StylePropsUtils.convertStylePropNameToNativeStylePropName(name), value])
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), <Record<string, unknown>>{});
    }
  
    static convertStylePropNameToNativeStylePropName(stylePropName: string) {
      return stylePropName.startsWith('--')
          ? stylePropName
          : isAllLowerCase(stylePropName)
          ? stylePropName 
          : stylePropName.replace(/(?:^\w|[A-Z]|\b-\w)/g, (match, i) =>
              i == 0 
              ? match.toLocaleLowerCase()
              : match[0] == '-' 
              ? match.toLocaleLowerCase() 
              : '-' + match.toLocaleLowerCase()
          );
    }
  }
  