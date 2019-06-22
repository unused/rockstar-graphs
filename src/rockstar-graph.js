/**
 * RockstarGraph data collection.
 **/
class RockstarGraph {
  initialize() {
    this._tourData = {};
  }

  set tourData(data) {
    this._tourData = data;
  }

  get tourData() {
    return this._tourData;
  }
}

export default RockstarGraph;
