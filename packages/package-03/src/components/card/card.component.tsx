
import React from 'react';
import { defineComponent } from "shared/utils";
// import { reactAdapter } from '../../utils/react-element.adapter';

// const foo: React.FC<{ username: string }> = ({ username }) => <div style={{
//   width: "500px",
//   height: "500px",
//   background: 'gray'
// }}>
//   <span>
//     Username : { username || 'NA' }
//   </span>
// </div>;

defineComponent(
  'user-card',
  HTMLDivElement
  // reactAdapter(foo)
)

export {}
