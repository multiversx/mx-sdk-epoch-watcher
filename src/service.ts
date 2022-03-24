import { ElrondStatsDto, EpochChangedInfo, EpochWatcherInfo } from './models';

export interface EpochWatcherConfiguration {
  getEpochWatcherInfo: () => Promise<EpochWatcherInfo | undefined>;
  setEpochWatcherInfo: (info: EpochWatcherInfo) => Promise<void>;
  loadElrondStats: () => Promise<ElrondStatsDto | undefined>;
  callback: (info: EpochChangedInfo) => Promise<void>;
}

export class EpochChangeWatcher {
  private readonly config: EpochWatcherConfiguration;

  constructor(config: EpochWatcherConfiguration) {
    this.config = config;
  }

  async execute(): Promise<void> {
    const epochWatcherInfo = await this.config.getEpochWatcherInfo();
    if (!epochWatcherInfo) {
      await this.loadAndCacheElrondStats();
      return;
    }

    if (this.estimatedEpochChangeTimePassed(epochWatcherInfo)) {
      await this.checkEpochChanged(epochWatcherInfo);
      return;
    }
  }

  private async checkEpochChanged(
    epochWatcherInfo: EpochWatcherInfo,
  ): Promise<void> {
    const now = Date.now();
    const stats = await this.loadStats();
    if (!stats) {
      return;
    }

    if (stats.epoch === epochWatcherInfo.epoch) {
      return;
    }

    await this.storeEpochWatcherInfo(now, stats);
    await this.config.callback({
      newEpoch: stats.epoch,
    });
  }

  private estimatedEpochChangeTimePassed(
    epochWatcherInfo: EpochWatcherInfo,
  ): boolean {
    const estimatedEpochChangeTime = epochWatcherInfo.statsLoadTime + epochWatcherInfo.timeLeftUntilEpochChange;
    return estimatedEpochChangeTime < Date.now();
  }

  private async loadAndCacheElrondStats(): Promise<void> {
    const now = Date.now();
    const stats = await this.loadStats();
    if (!stats) {
      return;
    }

    await this.storeEpochWatcherInfo(now, stats);
  }

  private async storeEpochWatcherInfo(
    now: number,
    stats: ElrondStatsDto,
  ): Promise<void> {
    await this.config.setEpochWatcherInfo({
      statsLoadTime: now,
      timeLeftUntilEpochChange: this.getTimeLeftUntilEpochChange(stats),
      epoch: stats.epoch,
    });
  }

  private getTimeLeftUntilEpochChange(
    stats: ElrondStatsDto,
  ): number {
    return (stats.roundsPerEpoch - stats.roundsPassed) * 6 * 1000;
  }

  private loadStats(): Promise<ElrondStatsDto | undefined> {
    return this.config.loadElrondStats();
  }
}
