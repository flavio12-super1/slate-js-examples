// // Import React dependencies.
// import React, { useCallback, useState, ReactNode } from "react";
// // Import the Slate editor factory.
// import {
//   Editor,
//   Transforms,
//   Range,
//   Point,
//   createEditor,
//   Descendant,
//   BaseEditor,
//   Element,
//   Text,
// } from "slate";

// // Import the Slate components and React plugin.
// import {
//   Slate,
//   Editable,
//   withReact,
//   ReactEditor,
//   RenderLeafProps,
// } from "slate-react";

// import "./App.css";

// // type CustomText = { text: string };
// interface CustomText extends Text {
//   bold?: true;
//   code?: boolean;
//   italic?: boolean;
//   underline?: boolean;
// }
// interface CustomElement extends Text {
//   type: "paragraph" | "code";
//   character?: string;
//   children: CustomText[];
// };
// // interface CustomElement extends Text {
// //   type: "paragraph";
// //   character?: string;
// //   children: CustomText[];
// // }

// // declare module "slate" {
// //   interface CustomTypes {
// //     Editor: BaseEditor & ReactEditor;
// //     Element: CustomElement;
// //     Text: CustomText;
// //   }
// // }

// const initialValue: CustomElement[] = [
//   {
//     type: "paragraph",
//     children: [{ text: "A line of text in a paragraph." }],
//   },
// ];

// const App = () => {
//   const [editor] = useState(() => withReact(createEditor()));
//   const [target, setTarget] = useState<Range | null>();
//   const [index, setIndex] = useState(0);
//   const [search, setSearch] = useState("");
//   const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

//   // Define a rendering function based on the element passed to `props`. We use
//   // `useCallback` here to memoize the function for subsequent renders.
//   const renderElement = useCallback((props: any) => {
//     switch (props.element.type) {
//       case "code":
//         return <CodeElement {...props} />;
//       default:
//         return <DefaultElement {...props} />;
//     }
//   }, []);

//   return (
//     <Slate
//       editor={editor}
//       initialValue={initialValue}
//       onChange={() => {
//         const { selection } = editor;

//         if (selection && Range.isCollapsed(selection)) {
//           console.log("selected");

//           const [start] = Range.edges(selection);
//           const wordBefore = Editor.before(editor, start, { unit: "word" });
//           const before = wordBefore && Editor.before(editor, wordBefore);
//           const beforeRange = before && Editor.range(editor, before, start);

//           const beforeText = beforeRange && Editor.string(editor, beforeRange);
//           const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
//           const after = Editor.after(editor, start);
//           const afterRange = Editor.range(editor, start, after);
//           const afterText = Editor.string(editor, afterRange);
//           const afterMatch = afterText.match(/^(\s|$)/);

//           if (beforeMatch && afterMatch) {
//             console.log("setting target and search");
//             setTarget(beforeRange);
//             //this sets the search depeting on what you typed in
//             setSearch(beforeMatch[1]);
//             setIndex(0);
//             return;
//           }
//         }

//         setTarget(null);
//       }}
//     >
//       <Editable
//         // Pass in the `renderElement` function.
//         renderElement={renderElement}
//         renderLeaf={renderLeaf}
//         onKeyDown={(event) => {
//           if (event.key === "`") {
//             event.preventDefault();
//             const [match] = Editor.nodes<CustomElement>(editor, {
//               match: (n): n is CustomElement =>
//                 Element.isElement(n) && n.type === "code",
//             });
//             // Toggle the block type depending on whether there's already a match.
//             Transforms.setNodes(
//               editor,
//               { type: match ? "paragraph" : "code" },
//               {
//                 match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
//               }
//             );
//           }
//         }}
//         placeholder="Enter some text..."
//       />
//     </Slate>
//   );
// };

// export default App;

// interface LeafProps extends RenderLeafProps {
//   attributes: {
//     "data-slate-leaf": true;
//     [key: string]: string | true;
//   };
//   children: ReactNode;
//   leaf: Text & {
//     bold?: boolean;
//     code?: boolean;
//     italic?: boolean;
//     underline?: boolean;
//   };
// }

// // Borrow Leaf renderer from the Rich Text example.
// // In a real project you would get this via `withRichText(editor)` or similar.
// const Leaf = ({ attributes, children, leaf }: LeafProps) => {
//   if (leaf.bold) {
//     children = <strong>{children}</strong>;
//   }

//   if (leaf.code) {
//     children = <code>{children}</code>;
//   }

//   if (leaf.italic) {
//     children = <em>{children}</em>;
//   }

//   if (leaf.underline) {
//     children = <u>{children}</u>;
//   }

//   return <span {...attributes}>{children}</span>;
// };

// const CodeElement = (props: any) => {
//   return (
//     <pre {...props.attributes} className="codeBlock">
//       <code>{props.children}</code>
//     </pre>
//   );
// };

// const DefaultElement = (props: any) => {
//   return (
//     <p {...props.attributes} className="textNode">
//       {props.children}
//     </p>
//   );
// };

// Import React dependencies.
import React, { useCallback, useState } from "react";
// Import the Slate editor factory.
import {
  Editor,
  Transforms,
  Range,
  Point,
  createEditor,
  Descendant,
  BaseEditor,
  Element,
} from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor } from "slate-react";

import "./App.css";

type CustomElement = { type: "paragraph" | "code"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const App = () => {
  const [editor] = useState(() => withReact(createEditor()));

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        // Pass in the `renderElement` function.
        renderElement={renderElement}
        onKeyDown={(event) => {
          if (event.key === "`") {
            event.preventDefault();
            const [match] = Editor.nodes<CustomElement>(editor, {
              match: (n): n is CustomElement =>
                Element.isElement(n) && n.type === "code",
            });
            // Toggle the block type depending on whether there's already a match.
            Transforms.setNodes(
              editor,
              { type: match ? "paragraph" : "code" },
              {
                match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
              }
            );
          }
        }}
      />
    </Slate>
  );
};

export default App;

const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes} className="codeBlock">
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: any) => {
  return (
    <p {...props.attributes} className="textNode">
      {props.children}
    </p>
  );
};
