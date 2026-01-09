import { describe, expect, test, type TestContext } from "vitest";
import {
  calculateSignalStrength,
  getRarityOrder,
  optimizeForRedstone,
  type OptimizedSlot,
  type Slot,
} from "../src/MinecraftItemBuilder";

const unstackableItem: Slot = {
  id: "",
  name: "",
  sprite: "",
  color: {
    rgb: [0, 0, 0],
    hsl: [0, 0, 0],
    hex: "",
  },
  category: [],
  group: [],
  material: "",
  stack_size: 1,
  rarity: "",
  quantity: 1,
};

const stackable16Item: Slot = {
  ...unstackableItem,
  stack_size: 16,
};

const stackable64Item: Slot = {
  ...unstackableItem,
  stack_size: 64,
};

test("Calling optimizeForRedstone() a second time will not change content", () => {
  const initialState = [null, unstackableItem, ...Array(52).fill(null)];
  const optimizedSlots = optimizeForRedstone(initialState);
  // Note that this doesn't completely reflects what happens in the UI because some properties of
  // optimizedSlots usually gets deleted in between calls to optimizeForRedstone()
  expect(optimizeForRedstone(optimizedSlots)).toStrictEqual(optimizedSlots);
});

// TODO: Write a test that expects going from redstone mode and back will not change the contents of a Cell

describe("Tests for calculateSignalStrength()", () => {
  test.each([
    [0, 0],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 2],
    [50, 13],
    [51, 14],
    [52, 14],
    [53, 14],
    [54, 15],
  ])(
    "Container with %i unstackables has a Redstone signal of %i",
    (n, expected) => {
      expect(calculateSignalStrength(Array(n).fill(unstackableItem))).toBe(
        expected
      );
    }
  );
});

describe("Correct redstone signals after calling optimizeForRedstone()", () => {
  function testSignals(
    slots: (OptimizedSlot | null)[],
    { annotate }: TestContext & object
  ) {
    const n = slots.filter((x) => x != null).length;
    const previousSignal = calculateSignalStrength(slots);
    const optimizedSlots = optimizeForRedstone(slots);
    const optimizedSignal = calculateSignalStrength(optimizedSlots);
    const optimizedNbItems = optimizedSlots.filter((x) => x != null).length;

    // Get the item with the largest stack size to give the smallest signal increment
    const largestStackSizeItem = optimizedSlots
      .filter((item) => item != null)
      .reduce((largestStackSizeItem: OptimizedSlot, currentItem) =>
        currentItem.stack_size > largestStackSizeItem.stack_size
          ? currentItem
          : largestStackSizeItem
      );

    // First slot is expected to be always be null (although that may change in the future)
    optimizedSlots[0] = { ...largestStackSizeItem, quantity: 1 };

    const optimizedSignalPlus1 = calculateSignalStrength(optimizedSlots);

    annotate(`n == ${n}`);
    annotate(`previousSignal == ${previousSignal}`);
    annotate(`optimizedNbItems == ${optimizedNbItems}`);
    annotate(`optimizedSignal == ${optimizedSignal}`);
    annotate(`optimizedSignalPlus1 == ${optimizedSignalPlus1}`);

    expect(optimizedSignal, "Signal strength changed after optimization").toBe(
      previousSignal
    );
    expect(optimizedSignalPlus1, "Container not at signal threshold").toBe(
      optimizedSignal + 1
    );
  }

  test.for(Array.from({ length: 53 }, (_, i) => i + 1))(
    "Optimized container with %j unstackables increases its Redstone signal when one more item is added",
    (n, context) => {
      const slots = [
        null,
        ...Array(n).fill(unstackableItem),
        ...Array(53 - n).fill(null),
      ];
      testSignals(slots, context);
    }
  );

  test.for(Array.from({ length: 53 }, (_, i) => i + 1))(
    "Optimized container with %j 16-stackables increases its Redstone signal when one more item is added",
    (n, context) => {
      const slots = [
        null,
        ...Array(n).fill(stackable16Item),
        ...Array(53 - n).fill(null),
      ];
      testSignals(slots, context);
    }
  );

  test.for(Array.from({ length: 53 }, (_, i) => i + 1))(
    "Optimized container with %j 64-stackables increases its Redstone signal when one more item is added",
    (n, context) => {
      const slots = [
        null,
        ...Array(n).fill(stackable64Item),
        ...Array(53 - n).fill(null),
      ];
      testSignals(slots, context);
    }
  );
});
