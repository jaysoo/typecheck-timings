This repo aims to provide typecheck comparisons between the old (integrated) TS setup and the new (workspaces + project references) TS setup.

The new setup should be faster on average, but in the cold cache case, it will be slower by definition. Several scenarios are tested:

Run the timings:

```shell
node bench.mjs
```

These are the results on my machine:

```shell
INTEGRATED SETUP (OLD)
----------------------
Timing typecheck... 63.19s

TS SOLUTION SETUP (NEW)
-----------------------
Timing typecheck (cold)... 120.06s
Timing typecheck (hot)... 0.35s
Timing typecheck (warm - 1 pkg updated)... 9.69s
Timing typecheck (warm - 5 pkg updated)... 45.06s
Timing typecheck (warm - 1 nested leaf pkg updated)... 14.19s
Timing typecheck (warm - 2 nested leaf pkg updated)... 28.03s
Timing typecheck (warm - 1 nested root pkg updated)... 1.29s
```
