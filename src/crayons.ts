import {
  window,
  workspace,
  Range,
  TextEditor,
  TextEditorDecorationType,
  OverviewRulerLane,
  DecorationOptions,
  DecorationRenderOptions,
} from "vscode";

export class Crayons {
  private words: string[];
  private editor: TextEditor;
  private decorationTypes: TextEditorDecorationType[];

  constructor(editor: TextEditor) {
    this.words = [];
    this.editor = editor;
    this.decorationTypes = fromConfig();
  }

  public highlight() {
    const word = this.getSelectedWord();
    const regex = RegExp(word, 'g');
    let decorations: DecorationOptions[] = [];
    let match;
    while ((match = regex.exec(this.editor.document.getText()))) {
      const decoration = {
        range: new Range(
          this.editor.document.positionAt(match.index),
          this.editor.document.positionAt(match.index + match[0].length)
        ),
      };
      decorations.push(decoration)
    }
    this.words.push(word);
    const idx = this.words.indexOf(word);
    this.editor.setDecorations(this.decorationTypes[idx], decorations);
  }

  public clear() {
    this.words = [];
    this.decorationTypes.forEach(decorationType =>
      this.editor.setDecorations(decorationType, []));
  }

  private getSelectedWord(): string {
    const range = this.editor.document.getWordRangeAtPosition(this.editor.selection.start);
    if (range) {
      return this.editor.document.getText(range);
    }
    return "";
  }

}

let editorCrayons = new Map<TextEditor, Crayons>();

function createIfAbsent<A, B>(key: A, map: Map<A, B>, def: () => B): B {
  let value = map.get(key);
  if (!value) {
    value = def();
    map.set(key, value);
  }
  return value;
}

export function getCrayonsMeta(editor: TextEditor): Crayons {
  return createIfAbsent(editor, editorCrayons, () => new Crayons(editor));
}

function fromConfig(): TextEditorDecorationType[] {
  const config = workspace.getConfiguration();
  const colors = config.get<Color[]>('crayons.configuration.colors');
  return colors?.map(color => toDecorationType(color)) || [];
}

function toDecorationType(color: Color) {
  return window.createTextEditorDecorationType({
    overviewRulerLane: OverviewRulerLane.Right,
    overviewRulerColor: "blue",
    light: {
      border: `2px solid ${color.light}`,
      borderRadius: "4px"
    },
    dark: {
      border: `2px solid ${color.dark}`,
      borderRadius: "4px"
    }
  } as DecorationRenderOptions);
}

interface Color {
  light: string;
  dark: string;
}
