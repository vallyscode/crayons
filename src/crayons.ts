import {
  window,
  workspace,
  Range,
  TextEditor,
  TextEditorDecorationType,
  OverviewRulerLane,
  DecorationOptions,
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
    this.decorate(this.getSelectedWord());
  }

  public refresh() {
    this.words.forEach(word => this.decorate(word));
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

  private decorate(word: string) {
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

    if (this.words.indexOf(word) === -1) {
      this.words.push(word);
    }

    let idx = this.words.indexOf(word);

    if (idx >= this.decorationTypes.length) {
      idx %= this.decorationTypes.length;
    }

    this.editor.setDecorations(this.decorationTypes[idx], decorations);
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

export function getCrayons(editor: TextEditor): Crayons {
  return createIfAbsent(editor, editorCrayons, () => new Crayons(editor));
}

function fromConfig(): TextEditorDecorationType[] {
  const config = workspace.getConfiguration();
  const colors = config.get<Color[]>('crayons.configuration.colors');
  return colors?.map(color => toDecorationType(color)) || [];
}

function toDecorationType(color: Color): TextEditorDecorationType {
  return window.createTextEditorDecorationType({
    overviewRulerLane: OverviewRulerLane.Right,
    overviewRulerColor: `${color.light.bg}`,
    light: {
      color: `${color.light.fg}`,
      backgroundColor: `${color.light.bg}`,
      fontStyle: "bold",
      border: `1px solid ${color.light.bg}`,
      borderRadius: "4px",
    },
    dark: {
      color: `${color.dark.fg}`,
      backgroundColor: `${color.dark.bg}`,
      fontStyle: "bold",
      border: `1px solid ${color.dark.bg}`,
      borderRadius: "4px",
    }
  });
}

interface Color {
  light: {
    bg: string,
    fg: string,
  };
  dark: {
    bg: string,
    fg: string
  };
}
