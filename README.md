
<div style="text-align:center">
  <img
  src="https://raw.githubusercontent.com/ElrondNetwork/elrond-go/master/elrond_logo_01.svg"
  alt="Elrond Network">
</div>

# Epoch Watcher

## **Description**

Package for monitoring when an epoch changes.

The epoch watcher service must be called inside a scheduler task how often it's needed.

An external storage is needed for storing Elrond Stats data of current epoch. (e.g.: Redis)

Elrond Stats must be loaded from an instance of [Elrond API](https://github.com/elrondNetwork/api.elrond.com), route: GET `/stats`.


## **Usage**

```ts
await new EpochWatcher({
getEpochWatcherInfo: () => redisClient.get(key),
setEpochWatcherInfo: (info) => redisClient.set(key, info, TTL), /* 1 day */,
loadElrondStats: () => elrondApi.getStats(),
callback: (info) => { console.log(`Epoch has changed. New epoch: ${info.newEpoch}.`); },
}).execute();
```
