This repo aims to provide typecheck comparisons between the old (integrated) TS setup and the new (workspaces + project references) TS setup.

The new setup should be faster on average, but in the cold cache case, it will be slower by definition. Several scenarios are tested:

Run the timings (if you are on MacOS then you will need `gtime` installed -- use `brew install gnu-time`):

```shell
node bench.mjs

# You probably need to increase max heap size as well or else the integrated run will run out of memory.
NODE_OPTIONS='--max-old-space-size=16000' node bench.mjs
```

NOTE: This script does not work on Windows currently due to missing `time` command to capture memory usage.

These are the results on my machine:

```shell
INTEGRATED SETUP (OLD)
----------------------
Timing typecheck... 186.53s (max memory: 6.14 GB)

TS SOLUTION SETUP (NEW)
-----------------------
Timing typecheck (cold)... 175.52s (max memory: 945.74 MB)
Timing typecheck (hot)... 25.33s (max memory: 429.68 MB)
Timing typecheck (warm - 1 pkg updated)... 36.33s (max memory: 655.14 MB)
Timing typecheck (warm - 5 pkg updated)... 48.21s (max memory: 702.96 MB)
Timing typecheck (warm - 25 pkg updated)... 65.25s (max memory: 666.78 MB)
Timing typecheck (warm - 100 pkg updated)... 80.69s (max memory: 664.58 MB)
Timing typecheck (warm - 1 nested leaf pkg updated)... 26.66s (max memory: 407.54 MB)
Timing typecheck (warm - 2 nested leaf pkg updated)... 31.17s (max memory: 889.86 MB)
Timing typecheck (warm - 1 nested root pkg updated)... 26.67s (max memory: 393.78 MB)
```
