
<div style="text-align:center">
  <img
  src="https://raw.githubusercontent.com/multiversx/mx-chain-go/master/multiversx-logo.svg" alt="MultiversX">
</div>

# Epoch Watcher

## **Description**

Package for monitoring when an epoch changes.

The epoch watcher service must be called inside a scheduler task how often it's needed.

An external storage is needed for storing MultiversX Stats data of current epoch. (e.g.: Redis)

MultiversX Stats must be loaded from an instance of [MultiversX API](https://github.com/multiversx/mx-api-service), route: GET `/stats`.


## **Usage**

```ts
await new EpochWatcher({
getEpochWatcherInfo: () => redisClient.get(key),
setEpochWatcherInfo: (epochWatcherInfo) => redisClient.set(key, info, TTL), /* 1 day */,
loadMultiversXStats: () => multiversxApi.getStats(),
callback: (info) => { console.log(`Epoch has changed. New epoch: ${info.newEpoch}.`); },
}).execute();
```

Models:


```ts
export class EpochChangedInfo {
  newEpoch: number;
}
```

```ts
export class EpochWatcherInfo {
  statsLoadTime: number;
  timeLeftUntilEpochChange: number;
  epoch: number;
}
```
