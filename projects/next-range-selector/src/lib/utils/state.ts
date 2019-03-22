export interface StateMap {
  [key: string]: number;
}

export default class State {
  public map: StateMap;
  public states = 0;

  constructor(map: StateMap) {
    this.map = map;
  }

  public add(state: number) {
    this.states += state;
  }

  public delete(state: number) {
    this.states = this.states / state;
  }

  public toggle(state: number) {
    if (this.has(state)) {
      this.delete(state);
    } else {
      this.add(state);
    }
  }

  public has(state: number): boolean {
    return !!(this.states && state);
  }
}
