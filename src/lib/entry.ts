const VERSION_REGEX = /^\/hsd:(\d{1,2}\.\d{1,2}\.\d{1,2})\/.*$/;

const SERVICES_NETWORK = 1 << 0;
const SERVICES_BLOOM = 1 << 1;

export class NodeDetails {
  peerVersion: number = 0;
  services: number = 0;
  height: number = 0;
  agent: string = '';
  noRelay: boolean = false;
  brontide: boolean = false;
  pruned: boolean = false;
  treeCompacted: boolean = false;

  private _version: string | null = null;

  get version() {
    if (this._version)
      return this._version;

    const match = this.agent.match(VERSION_REGEX);

    if (!match) {
      this._version = 'other';
      return this._version;
    }

    this._version = match[1];
    return this._version;
  }

  canSync() {
    return (this.services & SERVICES_NETWORK) && !this.noRelay;
  }

  hasBloom() {
    return Boolean(this.services & SERVICES_BLOOM);
  }

  fromJSON(json: ReturnType<typeof this.toJSON>) {
    const {peer, chain} = json;

    this.peerVersion = peer.version;
    this.services = peer.services;
    this.height = peer.height;
    this.agent = peer.agent;
    this.noRelay = peer.noRelay;
    this.brontide = peer.brontide;

    this.pruned = chain.pruned;
    this.treeCompacted = chain.treeCompacted;

    return this;
  }

  toJSON() {
    return {
      peer: {
        version: this.peerVersion,
        services: this.services,
        height: this.height,
        agent: this.agent,
        noRelay: this.noRelay,
        brontide: this.brontide
      },
      chain: {
        pruned: this.pruned,
        treeCompacted: this.treeCompacted
      }
    };
  }

  static fromJSON(json: ReturnType<typeof this.prototype.toJSON>) {
    const details = new this();
    details.fromJSON(json);
    return details;
  }
}

export class NodeEntry {
  logTimestamp: number = 0;

  time: number = 0;

  host: string = '';
  port: number = 0;
  brontide: boolean = false;

  error: string | null = null;
  result: NodeDetails | null = null;

  frequency: number = 0;
  interval: number = 0;

  get duration() {
    return this.logTimestamp - this.time;
  }

  get hostPort() {
    return `${this.host}:${this.port}`;
  }

  isSuccessful() {
    return this.error === null && this.result !== null;
  }

  isFailed() {
    return this.error !== null;
  }

  toJSON() {
    return {
      logTimestamp: this.logTimestamp,

      info: {
        time: this.time,
        host: this.host,
        port: this.port,
        brontide: this.brontide,

        error: this.error,
        result: this.result?.toJSON(),

        frequency: this.frequency,
        interval: this.interval
      }
    };
  }

  fromJSON(json: ReturnType<typeof this.toJSON>) {
    this.logTimestamp = json.logTimestamp;

    const {info} = json;

    this.time = info.time;
    this.host = info.host;
    this.port = info.port;
    this.brontide = info.brontide;

    this.error = info.error;

    if (info.result)
      this.result = NodeDetails.fromJSON(info.result);

    assert(!this.error || !this.result, 'Cannot have both error and result.');

    this.frequency = info.frequency;
    this.interval = info.interval;

    return this;
  }

  static fromJSON(json: ReturnType<typeof this.prototype.toJSON>) {
    const entry = new this();
    entry.fromJSON(json);
    return entry;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assert(value: any, msg: string) {
  if (!value)
    throw new Error(msg);
}
