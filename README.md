This repo aims to provide typecheck comparisons between the old (integrated) TS setup and the new (workspaces + project references) TS setup.

The new setup should be faster on average, but in the cold cache case, it will be slower by definition. Several scenarios are tested:

Run the timings (if you are on MacOS then you will need `gtime` installed -- use `brew install gnu-time`):

```shell
node bench.mjs
```

NOTE: This script does not work on Windows currently due to missing `time` command to capture memory usage.

These are the results on my machine:

```shell
INTEGRATED SETUP (OLD)
----------------------
Timing typecheck... 61.80s (max memory: 2.70 GB)

TS SOLUTION SETUP (NEW)
-----------------------
Timing typecheck (cold)... 116.74s (max memory: 1.57 GB)
Timing typecheck (hot)... 0.57s (max memory: 101.60 MB)
Timing typecheck (warm - 1 pkg updated)... 9.81s (max memory: 685.73 MB)
Timing typecheck (warm - 5 pkg updated)... 45.63s (max memory: 935.87 MB)
Timing typecheck (warm - 1 nested leaf pkg updated)... 14.31s (max memory: 796.62 MB)
Timing typecheck (warm - 2 nested leaf pkg updated)... 27.36s (max memory: 944.88 MB)
Timing typecheck (warm - 1 nested root pkg updated)... 1.38s (max memory: 243.01 MB)
```
