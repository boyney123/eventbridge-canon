import React from 'react';
import { v4 as uuid } from 'uuid';
import faker from 'faker';

import MonacoEditor, { EditorProps } from '@monaco-editor/react';

const Editor = (props: EditorProps) => {
  const onMount = (_, monaco) => {
    monaco.languages.registerCompletionItemProvider('json', {
      provideCompletionItems: function (model, position, ...args) {
        const word = model.getWordUntilPosition(position);

        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        return {
          suggestions: [
            {
              label: 'uuid()',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `"${uuid()}"`,
              range: range,
            },
            {
              label: 'randomName()',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `"${faker.name.findName()}"`,
              range: range,
            },
            {
              label: 'email()',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `"${faker.internet.email()}"`,
              range: range,
            },
            {
              label: 'image()',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `"${faker.image.image()}"`,
              range: range,
            },
            {
              label: 'pastDate()',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `"${faker.date.past()}"`,
              range: range,
            },
            {
              label: 'futureDate()',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `"${faker.date.future()}"`,
              range: range,
            },
          ],
        };
      },
    });
  };

  const { options, ...otherProps } = props;

  return <MonacoEditor options={{ minimap: { enabled: false }, fontSize: 16, ...options }} theme="vs-light" height="50vh" defaultLanguage="json" {...otherProps} onMount={onMount}></MonacoEditor>;
};

export default Editor;
