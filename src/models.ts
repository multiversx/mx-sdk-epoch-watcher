export class EpochWatcherInfo {
  statsLoadTime: number;
  timeLeftUntilEpochChange: number;
  epoch: number;
}

export interface ElrondStatsDto {
  shards: number,
  blocks: number,
  accounts: number,
  transactions: number,
  refreshRate: number,
  epoch: number,
  roundsPassed: number,
  roundsPerEpoch: number
}

export class EpochChangedInfo {
  newEpoch: number;
}
