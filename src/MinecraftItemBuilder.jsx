import { useState, useMemo, useEffect } from 'react';

import PlusIcon from './assets/plusicon.svg?react';
import XIcon from './assets/xicon.svg?react';
import GripIcon from './assets/gripicon.svg?react';
import SearchIcon from './assets/searchicon.svg?react';
import PalleteIcon from './assets/paletteicon.svg?react';
import ColorSortIcon from './assets/colorsorticon.svg?react';
import NamespaceSortIcon from './assets/namespaceicon.svg?react';
import TypeSortIcon from './assets/typesorticon.svg?react';

import './MinecraftItemBuilder.css';

function HueRangePicker({ hueRange, satRange, lumRange, onHueChange, onSatChange, onLumChange }) {
  const size = 180;
  const thickness = 25;
  const radius = (size - thickness) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const handleHueMouseDown = (e, isStart) => {
    e.preventDefault();
    const svg = e.currentTarget.closest('svg');
    const rect = svg.getBoundingClientRect();

    const handleMouseMove = (moveEvent) => {
      const x = moveEvent.clientX - rect.left - centerX;
      const y = moveEvent.clientY - rect.top - centerY;
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      angle = (angle + 90 + 360) % 360;

      if (isStart) {
        onHueChange([angle, hueRange[1]]);
      } else {
        onHueChange([hueRange[0], angle]);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    handleMouseMove(e);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getCoords = (angle) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad)
    };
  };

  const start = getCoords(hueRange[0]);
  const end = getCoords(hueRange[1]);

  // Calculate average color
  let avgHue = (hueRange[0] + hueRange[1]) / 2;
  if (Math.abs(hueRange[1] - hueRange[0]) > 180) {
    avgHue = (avgHue + 180) % 360;
  }
  const avgSat = (satRange[0] + satRange[1]) / 2;
  const avgLum = (lumRange[0] + lumRange[1]) / 2;
  const avgColor = `hsl(${avgHue}, ${avgSat}%, ${avgLum}%)`;

  return (
    <div className="flex items-center gap-3">
      {/* Saturation Slider */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-stone-400">S</div>
        <div className="relative h-32 flex items-center gap-1">
          {/* Range indicator box */}
          <div
            className="absolute border border-amber-500 pointer-events-none"
            style={{
              left: '-4px',
              right: '-4px',
              top: `${(1 - satRange[1] / 100) * 100}%`,
              bottom: `${satRange[0]}%`
            }}
          ></div>

          {/* Left handle for min value */}
          <div
            className="w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize z-20 hover:bg-amber-400 transition-colors border-2 border-black"
            style={{
              position: 'absolute',
              left: '-4px',
              top: `${(1 - satRange[0] / 100) * 100}%`,
              transform: 'translateY(-50%)'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const container = e.currentTarget.parentElement;
              const rect = container.getBoundingClientRect();
              const handleMove = (moveEvent) => {
                const y = Math.max(0, Math.min(rect.height, moveEvent.clientY - rect.top));
                const value = Math.round((1 - y / rect.height) * 100);
                onSatChange([Math.min(value, satRange[1]), satRange[1]]);
              };
              const handleUp = () => {
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('mouseup', handleUp);
              };
              handleMove(e);
              document.addEventListener('mousemove', handleMove);
              document.addEventListener('mouseup', handleUp);
            }}
          ></div>

          {/* Slider track */}
          <div className="relative w-6 h-full rounded overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-500 to-white"></div>
          </div>

          {/* Right handle for max value */}
          <div
            className="w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize z-20 hover:bg-amber-400 transition-colors border-2 border-black"
            style={{
              position: 'absolute',
              right: '-4px',
              top: `${(1 - satRange[1] / 100) * 100}%`,
              transform: 'translateY(-50%)'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const container = e.currentTarget.parentElement;
              const rect = container.getBoundingClientRect();
              const handleMove = (moveEvent) => {
                const y = Math.max(0, Math.min(rect.height, moveEvent.clientY - rect.top));
                const value = Math.round((1 - y / rect.height) * 100);
                onSatChange([satRange[0], Math.max(value, satRange[0])]);
              };
              const handleUp = () => {
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('mouseup', handleUp);
              };
              handleMove(e);
              document.addEventListener('mousemove', handleMove);
              document.addEventListener('mouseup', handleUp);
            }}
          ></div>
        </div>
        <div className="text-xs text-stone-400 w-12 text-center">{satRange[0]}-{satRange[1]}</div>
      </div>

      {/* Hue Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Draw hue wheel as segments */}
          {Array.from({ length: 36 }).map((_, i) => {
            const startAngle = (i * 10 - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * 10 - 90) * (Math.PI / 180);
            const hue = i * 10;

            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={`hsl(${hue + 5}, 100%, 50%)`}
                strokeWidth={thickness}
              />
            );
          })}

          {/* Range arc between markers */}
          {(() => {
            const innerRadius = radius - thickness / 2 - 2;

            // Check if entire range is selected (0-360 or very close to it)
            const isFullRange = (hueRange[0] === 0 && hueRange[1] === 360) ||
              (Math.abs(hueRange[1] - hueRange[0]) >= 359);

            if (isFullRange) {
              // Draw a complete circle when full range is selected
              return (
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={innerRadius}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                />
              );
            } else {
              // Draw arc between the two markers
              const startAngle = (hueRange[0] - 90) * (Math.PI / 180);
              const endAngle = (hueRange[1] - 90) * (Math.PI / 180);

              const x1 = centerX + innerRadius * Math.cos(startAngle);
              const y1 = centerY + innerRadius * Math.sin(startAngle);
              const x2 = centerX + innerRadius * Math.cos(endAngle);
              const y2 = centerY + innerRadius * Math.sin(endAngle);

              const arcLength = ((hueRange[1] - hueRange[0] + 360) % 360);
              const largeArc = arcLength > 180 ? 1 : 0;

              return (
                <path
                  d={`M ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            }
          })()}

          {/* Start marker */}
          <circle
            cx={start.x}
            cy={start.y}
            r="6"
            fill="#fbbf24"
            stroke="#000"
            strokeWidth="2"
            className="cursor-pointer"
            onMouseDown={(e) => handleHueMouseDown(e, true)}
          />

          {/* End marker */}
          <circle
            cx={end.x}
            cy={end.y}
            r="6"
            fill="#fbbf24"
            stroke="#000"
            strokeWidth="2"
            className="cursor-pointer"
            onMouseDown={(e) => handleHueMouseDown(e, false)}
          />
        </svg>

        {/* Center circle showing average color */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-stone-700"
          style={{ backgroundColor: avgColor }}
        ></div>
      </div>

      {/* Luminosity Slider */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-stone-400">L</div>
        <div className="relative h-32 flex items-center gap-1">
          {/* Range indicator box */}
          <div
            className="absolute border border-amber-500 pointer-events-none"
            style={{
              left: '-4px',
              right: '-4px',
              top: `${(1 - lumRange[1] / 100) * 100}%`,
              bottom: `${lumRange[0]}%`
            }}
          ></div>

          {/* Left handle for min value */}
          <div
            className="w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize z-20 hover:bg-amber-400 transition-colors border-2 border-black"
            style={{
              position: 'absolute',
              left: '-4px',
              top: `${(1 - lumRange[0] / 100) * 100}%`,
              transform: 'translateY(-50%)'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const container = e.currentTarget.parentElement;
              const rect = container.getBoundingClientRect();
              const handleMove = (moveEvent) => {
                const y = Math.max(0, Math.min(rect.height, moveEvent.clientY - rect.top));
                const value = Math.round((1 - y / rect.height) * 100);
                onLumChange([Math.min(value, lumRange[1]), lumRange[1]]);
              };
              const handleUp = () => {
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('mouseup', handleUp);
              };
              handleMove(e);
              document.addEventListener('mousemove', handleMove);
              document.addEventListener('mouseup', handleUp);
            }}
          ></div>

          {/* Slider track */}
          <div className="relative w-6 h-full rounded overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-500 to-black"></div>
          </div>

          {/* Right handle for max value */}
          <div
            className="w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize z-20 hover:bg-amber-400 transition-colors border-2 border-black"
            style={{
              position: 'absolute',
              right: '-4px',
              top: `${(1 - lumRange[1] / 100) * 100}%`,
              transform: 'translateY(-50%)'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const container = e.currentTarget.parentElement;
              const rect = container.getBoundingClientRect();
              const handleMove = (moveEvent) => {
                const y = Math.max(0, Math.min(rect.height, moveEvent.clientY - rect.top));
                const value = Math.round((1 - y / rect.height) * 100);
                onLumChange([lumRange[0], Math.max(value, lumRange[0])]);
              };
              const handleUp = () => {
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('mouseup', handleUp);
              };
              handleMove(e);
              document.addEventListener('mousemove', handleMove);
              document.addEventListener('mouseup', handleUp);
            }}
          ></div>
        </div>
        <div className="text-xs text-stone-400 w-12 text-center">{lumRange[0]}-{lumRange[1]}</div>
      </div>
    </div>
  );
}

export default function MinecraftItemBuilder() {
  const [catalogueItems, setCatalogueItems] = useState([]);
  const [cells, setCells] = useState(() => {
    const saved = localStorage.getItem('minecraftBuilder_cells');
    if (saved) {
      const parsedCells = JSON.parse(saved);
      // Migrate old 50-slot cells to 54-slot cells
      return parsedCells.map(cell => {
        if (cell.slots.length === 50) {
          // Add 4 more null slots to make it 54
          return { ...cell, slots: [...cell.slots, null, null, null, null] };
        }
        return cell;
      });
    }
    return [{ id: 1, slots: Array(54).fill(null) }];
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedSlot, setDraggedSlot] = useState(null);
  const [draggedCell, setDraggedCell] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [nextCellId, setNextCellId] = useState(() => {
    const saved = localStorage.getItem('minecraftBuilder_nextCellId');
    return saved ? parseInt(saved, 10) : 2;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hueRange, setHueRange] = useState([0, 360]);
  const [satRange, setSatRange] = useState([0, 100]);
  const [lumRange, setLumRange] = useState([0, 100]);
  const [moveAllMode, setMoveAllMode] = useState(false);
  const [displayMode, setDisplayMode] = useState(false); // false = normal, true = redstone optimization
  const [playerStats, setPlayerStats] = useState(() => {
    const saved = localStorage.getItem('minecraftBuilder_playerStats');
    return saved ? JSON.parse(saved) : null;
  }); // Player statistics from imported JSON
  const [statsSortMode, setStatsSortMode] = useState(() => {
    const saved = localStorage.getItem('minecraftBuilder_statsSortMode');
    return saved ? saved : 'none';
  }); // 'none', 'used', 'crafted', 'acquired'
  const [statsPercentRange, setStatsPercentRange] = useState([null, 100]); // Percentage range filter for stats (null = include all, 0-100 = only items with stats)
  const [selectedSlots, setSelectedSlots] = useState([]); // Array of {cellId, slotIndex}
  const [lastSelectedSlot, setLastSelectedSlot] = useState(null); // For shift-click range selection
  const [dragOverCell, setDragOverCell] = useState(null); // Track which cell is being dragged over
  const [categoryFilter, setCategoryFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [stackSizeFilters, setStackSizeFilters] = useState({ 1: false, 16: false, 64: false });
  const [rarityFilters, setRarityFilters] = useState({ "common": false, "uncommon": false, "rare": false, "epic": false });
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [showGroupSuggestions, setShowGroupSuggestions] = useState(false);
  const [showMaterialSuggestions, setShowMaterialSuggestions] = useState(false);
  const [catalogueWidth, setCatalogueWidth] = useState(400); // Width in pixels
  const [isDraggingDivider, setIsDraggingDivider] = useState(false);
  const [history, setHistory] = useState([]); // Store last 10 cell states for undo
  const [useRegex, setUseRegex] = useState(false);
  // Load items from JSON file
  useEffect(() => {
    fetch('items.json?v=' + Date.now())
      .then(response => response.json())
      .then(data => {
        // Parse category and group fields from string representations to actual arrays
        const processedData = data.map(item => {
          const processed = { ...item };

          // Parse category if it's a string representation of an array
          if (typeof item.category === 'string') {
            try {
              // Convert Python-style list string to JSON array string
              //  we should probably change the json file to have actuall json array and not a string array
              const jsonStr = item.category.replace(/'/g, '"');
              processed.category = JSON.parse(jsonStr);
            } catch (_e) {
              processed.category = [];
            }
          }

          // Parse group if it's a string representation of an array
          if (typeof item.group === 'string') {
            try {
              // Convert Python-style list string to JSON array string
              const jsonStr = item.group.replace(/'/g, '"');
              processed.group = JSON.parse(jsonStr);
            } catch (_e) {
              processed.group = [];
            }
          }

          return processed;
        });

        setCatalogueItems(processedData);

        const savedCells = localStorage.getItem('minecraftBuilder_cells');
        if (savedCells) {
          try {
            const parsedCells = JSON.parse(savedCells);
            const restoredCells = parsedCells.map(cell => ({
              ...cell,
              slots: cell.slots.map(slot => {
                if (!slot || !slot.id) return null;
                // Match item by id from catalogue
                return processedData.find(item => item.id === slot.id) || null;
              })
            }));
            setCells(restoredCells);
          } catch (e) {
            console.error('Error restoring cells:', e);
          }
        }

        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading items:', error);
        // should probably be another error msg
        alert('Failed to load items.json. Make sure the file exists in the same folder.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('minecraftBuilder_cells', JSON.stringify(cells));
  }, [cells]);

  useEffect(() => {
    localStorage.setItem('minecraftBuilder_nextCellId', nextCellId.toString());
  }, [nextCellId]);

  useEffect(() => {
    if (playerStats) {
      localStorage.setItem('minecraftBuilder_playerStats', JSON.stringify(playerStats));
    } else {
      localStorage.removeItem('minecraftBuilder_playerStats');
    }
  }, [playerStats]);

  useEffect(() => {
    localStorage.setItem('minecraftBuilder_statsSortMode', statsSortMode);
  }, [statsSortMode]);

  // Handle divider dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingDivider) {
        const newWidth = e.clientX;
        if (newWidth >= 300 && newWidth <= 800) {
          setCatalogueWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingDivider(false);
    };

    if (isDraggingDivider) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingDivider]);

  const usedItemIds = useMemo(() => {
    const used = new Set();
    cells.forEach(cell => {
      cell.slots.forEach(slot => {
        if (slot) used.add(slot.id);
      });
    });
    return used;
  }, [cells]);

  // Calculate tag suggestions (only include tags that appear on more than 2 items)
  const tagSuggestions = useMemo(() => {
    const categoryCounts = {};
    const groupCounts = {};
    const materialCounts = {};

    catalogueItems.forEach(item => {
      // Category and group are now arrays
      if (item.category && Array.isArray(item.category)) {
        item.category.forEach(cat => {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
      }
      if (item.group && Array.isArray(item.group)) {
        item.group.forEach(grp => {
          groupCounts[grp] = (groupCounts[grp] || 0) + 1;
        });
      }
      // Material remains a single string
      if (item.material) {
        materialCounts[item.material] = (materialCounts[item.material] || 0) + 1;
      }
    });

    return {
      categories: Object.keys(categoryCounts).filter(cat => categoryCounts[cat] > 2).sort(),
      groups: Object.keys(groupCounts).filter(grp => groupCounts[grp] > 2).sort(),
      materials: Object.keys(materialCounts).filter(mat => materialCounts[mat] > 1).sort()
    };
  }, [catalogueItems]);

  const availableItems = useMemo(() => {
    let filtered = catalogueItems.filter(item => !usedItemIds.has(item.id));

    // Apply tag filters (exact match, category and group are arrays)
    if (categoryFilter) {
      const catLower = categoryFilter.toLowerCase();
      filtered = filtered.filter(item =>
        item.category && Array.isArray(item.category) &&
        item.category.some(cat => cat.toLowerCase() === catLower)
      );
    }

    if (groupFilter) {
      const grpLower = groupFilter.toLowerCase();
      filtered = filtered.filter(item =>
        item.group && Array.isArray(item.group) &&
        item.group.some(grp => grp.toLowerCase() === grpLower)
      );
    }

    if (materialFilter) {
      const matLower = materialFilter.toLowerCase();
      filtered = filtered.filter(item =>
        item.material && item.material.toLowerCase() === matLower
      );
    }

    // Apply stack size filter
    const activeStackSizes = Object.keys(stackSizeFilters).filter(size => stackSizeFilters[size]).map(Number);
    if (activeStackSizes.length > 0) {
      filtered = filtered.filter(item =>
        item.stack_size && activeStackSizes.includes(item.stack_size)
      );
    }

    // Apply rarity filter
    const activeRarities = Object.keys(rarityFilters).filter(size => rarityFilters[size]).map(String);
    if (activeRarities.length > 0) {
      filtered = filtered.filter(item =>
        item.rarity && activeRarities.includes(item.rarity)
      );
    }

    // Apply color filter if not at default ranges
    const isColorFiltered = hueRange[0] !== 0 || hueRange[1] !== 360 ||
      satRange[0] !== 0 || satRange[1] !== 100 ||
      lumRange[0] !== 0 || lumRange[1] !== 100;

    if (isColorFiltered) {
      filtered = filtered.filter(item => {
        if (!item.color || !item.color.hsl) return false;

        const [h, s, l] = item.color.hsl;

        // Handle hue wrapping (e.g., 350-10 should include 0)
        let hueMatch;
        if (hueRange[0] <= hueRange[1]) {
          hueMatch = h >= hueRange[0] && h <= hueRange[1];
        } else {
          // Wraps around (e.g., 350 to 10)
          hueMatch = h >= hueRange[0] || h <= hueRange[1];
        }

        const satMatch = s >= satRange[0] && s <= satRange[1];
        const lumMatch = l >= lumRange[0] && l <= lumRange[1];

        return hueMatch && satMatch && lumMatch;
      });
    }

    // Apply search filter with enhanced logic
    if (searchTerm !== '' && !useRegex) {
      // Split by comma for OR groups
      const orGroups = searchTerm.split(',').map(t => t.trim()).filter(t => t.length > 0);

      filtered = filtered.filter(item => {
        const itemName = item.name.toLowerCase();
        const itemId = item.id.toLowerCase();

        // Item matches if ANY OR group matches
        return orGroups.some(orGroup => {
          // Split by & for AND terms within the group
          const andTerms = orGroup.split('&').map(t => t.trim()).filter(t => t.length > 0);

          // All AND terms must match for this OR group to match
          return andTerms.every(term => {
            const termLower = term.toLowerCase();

            // Check if term ends with underscore (isolated term match)
            if (termLower.endsWith('_')) {
              const isolatedTerm = termLower.slice(0, -1);
              // Match as isolated word in ID (e.g., "stone_" matches "stone_bricks" but not "sandstone")
              const regex = new RegExp(`(^|_)${isolatedTerm}(_|$)`);
              return regex.test(itemId);
            } else {
              // Regular substring match on name
              return itemName.includes(termLower);
            }
          });
        });
      });
    }
    if (searchTerm !== '' && useRegex) {
      filtered = filtered.filter(item => {
        const itemName = item.name.toLowerCase();
        const itemId = item.id.toLowerCase();
        let regex;
        try {
          regex = new RegExp(`${searchTerm}`);
          return regex.test(itemName) || regex.test(itemId);
        }
        catch {
          return true;
        }
      });
    }
    // Apply stats-based sorting and filtering if enabled
    if (statsSortMode !== 'none' && playerStats) {
      // Only filter out items without stats if min is not null (0 or higher)
      const excludeItemsWithoutStats = statsPercentRange[0] !== null;

      // Calculate scores for all items
      const itemsWithScores = filtered.map(item => {
        let score = 0;

        // Check if item has ANY relevant stats (mined, crafted, used, picked_up, dropped)
        const hasStats = !!(
          playerStats.mined?.[item.id] ||
          playerStats.crafted?.[item.id] ||
          playerStats.used?.[item.id] ||
          playerStats.picked_up?.[item.id] ||
          playerStats.dropped?.[item.id]
        );

        // Calculate score based on selected sort mode
        if (statsSortMode === 'used') {
          score = playerStats.used?.[item.id] || 0;
        } else if (statsSortMode === 'crafted') {
          score = playerStats.crafted?.[item.id] || 0;
        } else if (statsSortMode === 'acquired') {
          // Calculate acquired score: picked_up - dropped
          const pickedUp = playerStats.picked_up?.[item.id] || 0;
          const dropped = playerStats.dropped?.[item.id] || 0;
          score = pickedUp - dropped;
        }

        return { item, score, hasStats };
      });

      // If min > 0, filter out items without stats (they're treated as having score 0/null)
      let itemsToProcess = itemsWithScores;
      if (excludeItemsWithoutStats) {
        itemsToProcess = itemsWithScores.filter(({ hasStats }) => hasStats);
      }

      // Sort by score to prepare for percentile-based filtering
      const sortedItems = [...itemsToProcess].sort((a, b) => b.score - a.score);

      if (sortedItems.length > 0) {
        // Use percentile-based filtering instead of score-based
        // This counters Zipf distribution by filtering based on item count rather than score range
        const totalItems = sortedItems.length;

        // Apply logarithmic mapping to counter Zipf distribution
        // sortedItems is ordered highest score first (index 0 = best item, last index = worst item)
        // Slider semantics:
        //   - statsPercentRange[0] (bottom slider) = minimum RANK (0 = worst items, 100 = best items)
        //   - statsPercentRange[1] (top slider) = maximum RANK (0 = worst items, 100 = best items)
        //   - 0-100 shows all items
        //   - 50-100 shows top half (best items)
        //   - 0-50 shows bottom half (worst items)
        const mapPercentile = (linearPercent) => {
          if (linearPercent === 0) return 0;
          if (linearPercent === 100) return 100;
          // Use exponential curve: y = (e^(x/k) - 1) / (e^(100/k) - 1) * 100
          // k controls curve steepness, lower = more aggressive at start
          const k = 30;
          const normalized = (Math.exp(linearPercent / k) - 1) / (Math.exp(100 / k) - 1);
          return normalized * 100;
        };

        // Map slider percentages (rank) to array indices (inverted because array is best-first)
        // null means include all items from the bottom
        const mappedMinRank = statsPercentRange[0] === null ? 0 : mapPercentile(statsPercentRange[0]); // 0-100 rank
        const mappedMaxRank = mapPercentile(statsPercentRange[1]); // 0-100 rank

        // Convert rank to index: rank 0 = last index (worst), rank 100 = index 0 (best)
        // minIndex should be the WORSE of the two bounds (higher index)
        // maxIndex should be the BETTER of the two bounds (lower index)
        const maxIndex = Math.ceil(((100 - mappedMinRank) / 100) * totalItems);
        const minIndex = Math.floor(((100 - mappedMaxRank) / 100) * totalItems);

        filtered = sortedItems.slice(minIndex, maxIndex).map(({ item }) => item);
      } else {
        filtered = [];
      }
    }

    return filtered;
  }, [catalogueItems, usedItemIds, searchTerm, hueRange, satRange, lumRange, categoryFilter, groupFilter, materialFilter, stackSizeFilters, rarityFilters, statsSortMode, playerStats, statsPercentRange]);

  // Save current state to history (keep last 10)
  const saveToHistory = () => {
    // Efficient shallow clone of cells
    const cellsSnapshot = cells.map(cell => ({
      ...cell,
      slots: [...cell.slots]
    }));

    const newHistory = [...history, cellsSnapshot];
    if (newHistory.length > 10) {
      newHistory.shift(); // Remove oldest state
    }
    setHistory(newHistory);
  };

  // Undo the last action
  const undo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setCells(previousState);
      setHistory(history.slice(0, -1)); // Remove the state we just restored
    }
  };

  // Ctrl+Z handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, cells]);

  // Auto-scroll when dragging near viewport edges or outside window
  useEffect(() => {
    let scrollInterval = null;
    let lastMouseY = null;
    let isOutsideWindow = false;

    const updateScroll = () => {
      const isDragging = draggedItem || draggedCell || draggedSlot;

      if (!isDragging) {
        if (scrollInterval) {
          clearInterval(scrollInterval);
          scrollInterval = null;
        }
        return;
      }

      const scrollSpeed = 10;
      const scrollThreshold = 50; // Start scrolling within 50px of edge
      const viewportHeight = window.innerHeight;

      // Clear existing interval
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }

      // If mouse left the window, use last known position to determine direction
      if (isOutsideWindow && lastMouseY !== null) {
        if (lastMouseY < scrollThreshold) {
          // Was near top, scroll up
          scrollInterval = setInterval(() => {
            window.scrollBy(0, -scrollSpeed);
          }, 16);
        } else if (lastMouseY > viewportHeight - scrollThreshold) {
          // Was near bottom, scroll down
          scrollInterval = setInterval(() => {
            window.scrollBy(0, scrollSpeed);
          }, 16);
        }
      }
      // Mouse is inside window
      else if (lastMouseY !== null) {
        if (lastMouseY < scrollThreshold) {
          scrollInterval = setInterval(() => {
            window.scrollBy(0, -scrollSpeed);
          }, 16);
        } else if (lastMouseY > viewportHeight - scrollThreshold) {
          scrollInterval = setInterval(() => {
            window.scrollBy(0, scrollSpeed);
          }, 16);
        }
      }
    };

    const handleMouseMove = (e) => {
      lastMouseY = e.clientY;
      isOutsideWindow = false;
      updateScroll();
    };

    const handleMouseLeave = () => {
      // Keep last known position and mark as outside
      isOutsideWindow = true;
      updateScroll();
    };

    const handleMouseEnter = () => {
      isOutsideWindow = false;
    };

    const handleMouseUp = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }
      lastMouseY = null;
      isOutsideWindow = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('dragend', handleMouseUp);

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('dragend', handleMouseUp);
    };
  }, [draggedItem, draggedCell, draggedSlot]);

  const addCell = () => {
    saveToHistory();
    setCells([...cells, { id: nextCellId, slots: Array(54).fill(null) }]);
    setNextCellId(nextCellId + 1);
  };

  const removeCell = (cellId) => {
    saveToHistory();
    setCells(cells.filter(c => c.id !== cellId));
  };

  // Export cells to JSON (Litematica material list format)
  const exportCells = () => {
    const items = [];

    cells.forEach((cell, cellIndex) => {
      cell.slots.forEach(slot => {
        if (slot) {
          items.push({
            id: slot.id,
            count: slot.quantity || 1,
            cell: cellIndex
          });
        }
      });
    });

    const exportData = {
      name: "Item Layout",
      items: items
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'item-layout.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import cells from JSON (supports both old array format and new Litematica format)
  const importCells = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);

        let newCells = [];

        // Check if this is the new Litematica format (has "items" array)
        if (importData.items && Array.isArray(importData.items)) {
          // New Litematica format: {name: "...", items: [{id, count, cell}, ...]}
          // Group items by cell
          const cellMap = new Map();

          importData.items.forEach(item => {
            const cellIndex = item.cell ?? 0;
            if (!cellMap.has(cellIndex)) {
              cellMap.set(cellIndex, []);
            }

            // Find the item in catalogue by id
            const catalogueItem = catalogueItems.find(i => i.id === item.id);
            if (catalogueItem) {
              // Create a copy with the quantity from the import
              const itemWithQuantity = { ...catalogueItem, quantity: item.count };
              cellMap.get(cellIndex).push(itemWithQuantity);
            }
          });

          // Convert cell map to array of cells
          const maxCellIndex = Math.max(...cellMap.keys());
          for (let i = 0; i <= maxCellIndex; i++) {
            const cellItems = cellMap.get(i) || [];
            const slots = Array(54).fill(null);

            // Fill slots starting from slot 1 (slot 0 is reserved)
            cellItems.forEach((item, index) => {
              if (index + 1 < 54) {
                slots[index + 1] = item;
              }
            });

            newCells.push({
              id: nextCellId + i,
              slots: slots
            });
          }
        } else if (Array.isArray(importData)) {
          // Old array format: [[itemId, itemId, ...], ...]
          newCells = importData.map((cellData, index) => {
            const slots = cellData.map(itemId => {
              if (itemId === null) return null;
              // Find the item in catalogue by id
              const item = catalogueItems.find(i => i.id === itemId);
              return item || null;
            });

            // Check if this is an old 50-slot layout
            const isOldLayout = slots.length === 50;

            if (isOldLayout) {
              // Old layout: shift all items up by 1 to make room for reserved slot 0
              const migratedSlots = [null, ...slots];
              while (migratedSlots.length < 54) migratedSlots.push(null);
              return {
                id: nextCellId + index,
                slots: migratedSlots
              };
            } else {
              // New layout or different size - ensure exactly 54 slots
              while (slots.length < 54) slots.push(null);
              if (slots.length > 54) slots.length = 54;
              return {
                id: nextCellId + index,
                slots: slots
              };
            }
          });
        } else {
          alert('Invalid file format: Expected Litematica format or array of cells');
          return;
        }

        setCells(newCells);
        setNextCellId(nextCellId + newCells.length);

        // Clear selection
        setSelectedSlots([]);
        setLastSelectedSlot(null);
      } catch (error) {
        alert('Error parsing file: ' + error.message);
      }
    };
    reader.readAsText(file);

    // Reset the file input so the same file can be imported again
    event.target.value = '';
  };

  // Import player statistics from JSON
  const importStats = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const stats = JSON.parse(e.target.result);
        setPlayerStats(stats);
        alert('Player statistics imported successfully!');
      } catch (error) {
        alert('Error parsing stats file: ' + error.message);
      }
    };
    reader.readAsText(file);

    // Reset the file input
    event.target.value = '';
  };

  // Calculate "acquired" score: picked_up - dropped
  // Higher score = player wants to keep the item
  const calculateAcquiredScore = (itemId) => {
    if (!playerStats) return 0;

    const pickedUp = playerStats.picked_up?.[itemId] || 0;
    const dropped = playerStats.dropped?.[itemId] || 0;

    return pickedUp - dropped;
  };

  // Slot selection handler
  const handleSlotClick = (e, cellId, slotIndex, item) => {
    if (!item) return; // Can't select empty slots

    const slotKey = `${cellId}-${slotIndex}`;
    const isAlreadySelected = selectedSlots.some(s => s.cellId === cellId && s.slotIndex === slotIndex);

    if (e.shiftKey && lastSelectedSlot && lastSelectedSlot.cellId === cellId) {
      // Shift-click: Select range from last selected to current
      const startIndex = Math.min(lastSelectedSlot.slotIndex, slotIndex);
      const endIndex = Math.max(lastSelectedSlot.slotIndex, slotIndex);

      const rangeSelection = [];
      const cell = cells.find(c => c.id === cellId);
      for (let i = startIndex; i <= endIndex; i++) {
        if (cell.slots[i]) { // Only select filled slots
          rangeSelection.push({ cellId, slotIndex: i });
        }
      }
      setSelectedSlots(rangeSelection);
    } else if (e.ctrlKey || e.metaKey) {
      // Ctrl-click: Toggle selection
      if (isAlreadySelected) {
        setSelectedSlots(selectedSlots.filter(s => !(s.cellId === cellId && s.slotIndex === slotIndex)));
      } else {
        setSelectedSlots([...selectedSlots, { cellId, slotIndex }]);
      }
      setLastSelectedSlot({ cellId, slotIndex });
    } else {
      // Normal click: Deselect if clicking already selected item, otherwise select only this slot
      if (isAlreadySelected && selectedSlots.length === 1) {
        // Clicking the only selected item - deselect it
        setSelectedSlots([]);
        setLastSelectedSlot(null);
      } else {
        // Select only this slot
        setSelectedSlots([{ cellId, slotIndex }]);
        setLastSelectedSlot({ cellId, slotIndex });
      }
    }
  };

  // Clear selection when clicking empty space
  const handleBackgroundClick = () => {
    setSelectedSlots([]);
    setLastSelectedSlot(null);
  };

  // Item drag handlers
  const handleItemDragStart = (e, item, source) => {
    if (source.type === 'catalogue') {
      setDraggedItem({ item, source });
    } else if (source.type === 'slot') {
      // Check if dragging a selected slot
      const isDraggingSelected = selectedSlots.some(
        s => s.cellId === source.cellId && s.slotIndex === source.slotIndex
      );

      if (isDraggingSelected && selectedSlots.length > 1) {
        // Dragging multiple selected items
        setDraggedItem({ item, source });
        setDraggedSlot({
          cellId: source.cellId,
          slotIndex: source.slotIndex,
          item,
          multiSelect: true,
          selectedSlots: [...selectedSlots]
        });
      } else {
        // Dragging single item
        setDraggedItem({ item, source });
        setDraggedSlot({ cellId: source.cellId, slotIndex: source.slotIndex, item });
      }
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // Improves drag performance
  };

  const handleItemDragEnd = (e) => {
    setDraggedItem(null);
    setDraggedSlot(null);
    setDragOverSlot(null);
  };

  const handleItemDragOver = (e, cellId, slotIndex) => {
    // Skip if we're dragging a cell (not an item)
    if (draggedCell) {
      e.stopPropagation(); // Prevent event from bubbling to cell
      return;
    }

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Update drag over state for visual feedback
    const slotKey = `${cellId}-${slotIndex}`;
    if (dragOverSlot !== slotKey) {
      setDragOverSlot(slotKey);
    }
  };

  const handleItemDragLeave = (e) => {
    // Skip if we're dragging a cell (not an item)
    if (draggedCell) {
      return;
    }

    // Only clear if we're actually leaving (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverSlot(null);
    }
  };

  const handleItemDrop = (e, cellId, slotIndex) => {
    // Skip if we're dragging a cell (not an item)
    if (draggedCell) {
      return;
    }

    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling to cell drop handler
    setDragOverSlot(null);

    // Handle displayMode substitution
    if (displayMode && draggedSlot) {
      const targetCell = cells.find(c => c.id === cellId);

      // Only allow substitution within the same cell
      if (draggedSlot.cellId === cellId) {
        const displaySlots = optimizeForRedstone(targetCell.slots);
        const targetItem = displaySlots[slotIndex];

        // Check if dropping on an adjusted item
        if (targetItem && targetItem.isAdjusted) {
          // Pass display indices, not actual slot data
          substituteAdjustedItem(cellId, slotIndex, draggedSlot.slotIndex);
          setDraggedItem(null);
          setDraggedSlot(null);
          return;
        }
      }
      // If not substituting, don't allow any other drops in displayMode
      setDraggedItem(null);
      setDraggedSlot(null);
      return;
    }

    saveToHistory(); // Save state before making changes

    const targetSlot = cells.find(c => c.id === cellId).slots[slotIndex];

    if (draggedItem && draggedItem.source.type === 'catalogue') {
      // Dragging from catalogue - always INSERT (displace items)
      if (moveAllMode) {
        // Fill all empty slots with filtered items (skip slot 0)
        setCells(cells.map(cell => {
          if (cell.id === cellId) {
            const newSlots = [...cell.slots];
            let itemIndex = 0;

            // Start at i = 1 to skip reserved slot 0
            for (let i = 1; i < newSlots.length && itemIndex < availableItems.length; i++) {
              if (newSlots[i] === null) {
                newSlots[i] = availableItems[itemIndex];
                itemIndex++;
              }
            }

            return { ...cell, slots: newSlots };
          }
          return cell;
        }));
      } else {
        // Single item from catalogue - INSERT at target position
        setCells(cells.map(cell => {
          if (cell.id === cellId) {
            const newSlots = [...cell.slots];

            // Don't allow dropping in slot 0
            if (slotIndex === 0) {
              return cell;
            }

            // Insert at the target position, shifting everything right
            // Shift items from the end backwards to make room
            for (let i = 53; i > slotIndex; i--) {
              newSlots[i] = newSlots[i - 1];
            }

            // Place the new item at the target slot
            newSlots[slotIndex] = draggedItem.item;

            // Ensure slot 0 is always null
            newSlots[0] = null;

            return { ...cell, slots: newSlots };
          }
          return cell;
        }));
      }
    }
    else if (draggedSlot) {
      if (draggedSlot.multiSelect) {
        // Dragging multiple selected items
        const itemsToMove = [];

        // Collect items from selected slots (sorted by slot index)
        const sortedSelection = [...draggedSlot.selectedSlots].sort((a, b) => {
          if (a.cellId !== b.cellId) return a.cellId - b.cellId;
          return a.slotIndex - b.slotIndex;
        });

        sortedSelection.forEach(slot => {
          const sourceCell = cells.find(c => c.id === slot.cellId);
          if (sourceCell && sourceCell.slots[slot.slotIndex]) {
            itemsToMove.push({
              item: sourceCell.slots[slot.slotIndex],
              sourceCellId: slot.cellId,
              sourceSlotIndex: slot.slotIndex
            });
          }
        });

        // Find the target cell and use the drop target slot as insertion point
        const targetCell = cells.find(c => c.id === cellId);

        // Check if we're moving within the same cell
        const isSameCell = itemsToMove.every(item => item.sourceCellId === cellId);

        // Proceed with the move
        setCells(cells.map(cell => {
          if (cell.id === cellId) {
            // Working with the target cell
            let newSlots = [...cell.slots];

            if (isSameCell) {
              // Moving within same cell - remove selected items, then insert at drop position
              const selectedIndices = draggedSlot.selectedSlots
                .filter(s => s.cellId === cellId)
                .map(s => s.slotIndex)
                .filter(idx => idx > 0) // Exclude slot 0
                .sort((a, b) => a - b);

              // Step 1: Collect selected items
              const selectedItems = selectedIndices.map(idx => newSlots[idx]);

              // Step 2: Create array without selected items and compact it
              const remainingItems = [];
              for (let i = 1; i < 54; i++) {
                if (!selectedIndices.includes(i) && newSlots[i] !== null) {
                  remainingItems.push(newSlots[i]);
                }
              }

              // Step 3: Find where to insert in the compacted remaining array
              // We want selected items to take the exact drop slot position
              // So count non-selected items that will be BEFORE the drop position in final arrangement
              // This means: items before drop slot, OR items at drop slot if we're inserting after them
              let insertPosition = 0;
              const isTargetBeforeSelection = slotIndex < selectedIndices[0];
              const isTargetAfterSelection = slotIndex > selectedIndices[selectedIndices.length - 1];

              for (let i = 1; i < slotIndex; i++) {
                if (!selectedIndices.includes(i) && newSlots[i] !== null) {
                  insertPosition++;
                }
              }

              // If target is after the selection, also count the target itself
              if (isTargetAfterSelection && !selectedIndices.includes(slotIndex) && newSlots[slotIndex] !== null) {
                insertPosition++;
              }

              // Step 4: Insert selected items at the calculated position
              const finalItems = [
                ...remainingItems.slice(0, insertPosition),
                ...selectedItems,
                ...remainingItems.slice(insertPosition)
              ];

              // Step 5: Build final 54-slot array
              const finalSlots = [null]; // Slot 0
              for (let i = 0; i < 53; i++) {
                finalSlots.push(finalItems[i] || null);
              }

              return { ...cell, slots: finalSlots };
            } else {
              // Moving from different cell(s)
              // Step 1: Remove items being moved from source cells (if this is a source cell)
              itemsToMove.forEach(({ sourceCellId, sourceSlotIndex }) => {
                if (cell.id === sourceCellId) {
                  newSlots[sourceSlotIndex] = null;
                }
              });

              // Step 2: Compact to remove gaps (preserve slot 0)
              let compacted = newSlots.slice(1).filter(slot => slot !== null);

              // Step 3: Calculate insertion point in compacted array
              let insertIndex = Math.max(0, slotIndex - 1);
              // Adjust if some slots before target were null
              let nullsBefore = 0;
              for (let i = 1; i < slotIndex && i < cell.slots.length; i++) {
                if (cell.slots[i] === null) nullsBefore++;
              }
              insertIndex = Math.max(0, insertIndex - nullsBefore);
              insertIndex = Math.min(insertIndex, compacted.length);

              // Step 4: Check if items will fit (53 usable slots)
              const totalItems = compacted.length + itemsToMove.length;
              if (totalItems > 53) {
                // Won't fit - cancel operation
                // Return original slots for this cell
                return cell;
              }

              // Step 5: Insert moved items at insertion point
              const finalSlots = [
                ...compacted.slice(0, insertIndex),
                ...itemsToMove.map(item => item.item),
                ...compacted.slice(insertIndex)
              ];

              // Pad with nulls
              while (finalSlots.length < 53) {
                finalSlots.push(null);
              }

              // Reconstruct with slot 0 as null
              return { ...cell, slots: [null, ...finalSlots] };
            }
          } else {
            // Not the target cell - just remove moved items and compact
            const newSlots = [...cell.slots];
            itemsToMove.forEach(({ sourceCellId, sourceSlotIndex }) => {
              if (cell.id === sourceCellId) {
                newSlots[sourceSlotIndex] = null;
              }
            });

            // Compact slots 1-53, preserve slot 0
            const compacted = newSlots.slice(1).filter(slot => slot !== null);
            while (compacted.length < 53) {
              compacted.push(null);
            }

            return { ...cell, slots: [null, ...compacted] };
          }
        }));

        setSelectedSlots([]);
        setLastSelectedSlot(null);
      } else {
        // Dragging single item - INSERT (displace items)
        const isSameCell = draggedSlot.cellId === cellId;

        setCells(cells.map(cell => {
          let newSlots = [...cell.slots];

          if (isSameCell && cell.id === cellId) {
            // Moving within same cell - same logic as catalogue drop
            const sourceIndex = draggedSlot.slotIndex;
            const targetIndex = slotIndex;

            if (sourceIndex === targetIndex) {
              // Dropping on same slot - no change
              return cell;
            }

            // Don't allow dropping in slot 0
            if (targetIndex === 0) {
              return cell;
            }

            // Save the item being moved
            const item = newSlots[sourceIndex];

            // Create a clean copy without the source item
            const slotsWithoutSource = [];
            for (let i = 0; i < 54; i++) {
              if (i !== sourceIndex) {
                slotsWithoutSource.push(newSlots[i]);
              }
            }
            // Now slotsWithoutSource has 53 elements

            // Build final array by inserting at target position
            const finalSlots = [];

            // Add everything before target
            for (let i = 0; i < targetIndex; i++) {
              finalSlots.push(slotsWithoutSource[i]);
            }

            // Insert the item at target
            finalSlots.push(item);

            // Add everything from target onwards
            for (let i = targetIndex; i < 53; i++) {
              finalSlots.push(slotsWithoutSource[i]);
            }

            // Ensure slot 0 is null
            finalSlots[0] = null;

            return { ...cell, slots: finalSlots };
          } else if (cell.id === draggedSlot.cellId) {
            // Source cell - remove item
            newSlots[draggedSlot.slotIndex] = null;
            return { ...cell, slots: newSlots };
          } else if (cell.id === cellId) {
            // Target cell - insert item at exact position
            // Don't allow dropping in slot 0
            if (slotIndex === 0) {
              return cell;
            }

            // Shift items from the end backwards to make room
            for (let i = 53; i > slotIndex; i--) {
              newSlots[i] = newSlots[i - 1];
            }

            // Place the item at the target slot
            newSlots[slotIndex] = draggedSlot.item;

            // Ensure slot 0 is null
            newSlots[0] = null;

            return { ...cell, slots: newSlots };
          }

          return cell;
        }));
      }
    }

    setDraggedItem(null);
    setDraggedSlot(null);
  };

  // Calculate redstone signal strength for a container
  // Based on: floor(14/inv_size * reduce(items, (item:1)/min(64, stack_limit(item:0)) + _a, 0) + min(1, length(items)))
  const calculateSignalStrength = (slots) => {
    const invSize = 54;
    const items = slots.filter(item => item !== null);

    if (items.length === 0) return 0;

    const fillSum = items.reduce((sum, item) => {
      const stackLimit = Math.min(64, item.stack_size || 64);
      const quantity = item.quantity || 1;
      return sum + (quantity / stackLimit);
    }, 0);

    return Math.floor((14 / invSize) * fillSum + Math.min(1, items.length));
  };

  // Optimize container to ensure adding one more item increments signal strength
  const optimizeForRedstone = (slots) => {
    const invSize = 54;
    const items = slots.slice(1).filter(item => item !== null); // Skip slot 0

    if (items.length === 0) return slots;

    // Always use the simpler logic: items are adjusted if they have quantity > 1 OR multiple instances exist
    let optimizedSlots = slots.map((item, idx) => item ? { ...item, quantity: item.quantity || 1, originalIndex: idx } : null);
    let currentSignal = calculateSignalStrength(optimizedSlots);

    // Count occurrences of each item ID
    const itemCounts = {};
    for (let i = 1; i < optimizedSlots.length; i++) {
      if (optimizedSlots[i]) {
        itemCounts[optimizedSlots[i].id] = (itemCounts[optimizedSlots[i].id] || 0) + 1;
      }
    }

    // Mark items that are already adjusted (have quantity > 1 OR multiple instances)
    // These are items we want to preserve from substitution
    for (let i = 1; i < optimizedSlots.length; i++) {
      if (optimizedSlots[i]) {
        const hasMultipleInstances = itemCounts[optimizedSlots[i].id] > 1;
        const hasQuantity = (optimizedSlots[i].quantity || 1) > 1;
        if (hasQuantity || hasMultipleInstances) {
          optimizedSlots[i].forceAdjusted = true;
        }
      }
    }

    // Check if we have any items with quantity adjustments (not just duplicates)
    const hasQuantityAdjustments = optimizedSlots.some(item => item && (item.quantity || 1) > 1);

    // Check if we have any user-substituted items (from manual drag-drop substitution)
    const hasUserSubstituted = optimizedSlots.some(item => item && item.userSubstituted === true);

    // If we don't have quantity adjustments AND no user substitutions, mark ALL items as candidates
    if (!hasQuantityAdjustments && !hasUserSubstituted) {
      // Mark ALL items as candidates for adjustment
      for (let i = optimizedSlots.length - 1; i >= 1; i--) {
        if (optimizedSlots[i]) {
          optimizedSlots[i].forceAdjusted = true;
        }
      }
    }
    // If we have user substitutions, only use items with forceAdjusted (preserves user choices)

    // Find items that should be adjusted
    const forcedItems = optimizedSlots.filter(item => item && item.forceAdjusted === true);
    const hasUnstackable = forcedItems.some(item => (item.stack_size || 64) === 1);
    const hasSixteen = forcedItems.some(item => (item.stack_size || 64) === 16);
    const hasSixtyFour = forcedItems.some(item => (item.stack_size || 64) === 64);

    // Strategy 1: Duplicate unstackables if available (only if no quantity adjustments exist)
    if (hasUnstackable && !hasQuantityAdjustments) {
      // Find the most common unstackable to duplicate (prefer lower rarity)
      const unstackables = forcedItems.filter(item => (item.stack_size || 64) === 1);
      const targetUnstackable = unstackables
        .sort((a, b) => {
          const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3 };
          return (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0);
        })[0];

      if (targetUnstackable) {
        // Fill empty slots with this unstackable until signal increments
        for (let i = 1; i < optimizedSlots.length; i++) {
          if (optimizedSlots[i] === null) {
            optimizedSlots[i] = { ...targetUnstackable, quantity: 1, originalIndex: -1, isDuplicate: true, forceAdjusted: true };
            const newSignal = calculateSignalStrength(optimizedSlots);
            if (newSignal > currentSignal) {
              // Remove this last one so we're at the threshold
              optimizedSlots[i] = null;
              break;
            }
          }
        }
      }
    }

    // Strategy 2: Increment 16-stackables from the END
    if (hasSixteen) {
      while (true) {
        let incremented = false;
        for (let i = optimizedSlots.length - 1; i >= 1; i--) {
          if (optimizedSlots[i] && optimizedSlots[i].forceAdjusted === true && (optimizedSlots[i].stack_size || 64) === 16) {
            if (optimizedSlots[i].quantity < 16) {
              optimizedSlots[i].quantity++;
              const newSignal = calculateSignalStrength(optimizedSlots);
              if (newSignal > currentSignal) {
                optimizedSlots[i].quantity--;
                break;
              }
              incremented = true;
              break;
            }
          }
        }
        if (!incremented) break;
      }
    }

    // Strategy 3: Increment 64-stackables from the END
    if (hasSixtyFour) {
      while (true) {
        let incremented = false;
        for (let i = optimizedSlots.length - 1; i >= 1; i--) {
          if (optimizedSlots[i] && optimizedSlots[i].forceAdjusted === true && (optimizedSlots[i].stack_size || 64) === 64) {
            if (optimizedSlots[i].quantity < 64) {
              optimizedSlots[i].quantity++;
              const newSignal = calculateSignalStrength(optimizedSlots);
              if (newSignal > currentSignal) {
                optimizedSlots[i].quantity--;
                break;
              }
              incremented = true;
              break;
            }
          }
        }
        if (!incremented) break;
      }
    }

    // Strategy 4: Duplicate stackables if needed (only if no quantity adjustments exist)
    // This runs if all existing stacks are maxed and we still haven't reached threshold
    if (!hasQuantityAdjustments) {
      let finalSignal = calculateSignalStrength(optimizedSlots);
      if (finalSignal === currentSignal) {
        // Check if all items are at their stack limits
        let allMaxed = true;
        for (let i = 1; i < optimizedSlots.length; i++) {
          if (optimizedSlots[i] && optimizedSlots[i].forceAdjusted === true) {
            const stackLimit = optimizedSlots[i].stack_size || 64;
            if (optimizedSlots[i].quantity < stackLimit) {
              allMaxed = false;
              break;
            }
          }
        }

        // Only duplicate if all existing stacks are maxed
        if (allMaxed) {
          // Try duplicating items (prefer lower rarity and smaller stack sizes)
          const availableItems = forcedItems
            .filter(item => item !== null)
            .sort((a, b) => {
              const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3 };
              const rarityA = rarityOrder[a.rarity] || 0;
              const rarityB = rarityOrder[b.rarity] || 0;
              if (rarityA !== rarityB) return rarityA - rarityB;
              const stackA = a.stack_size || 64;
              const stackB = b.stack_size || 64;
              return stackA - stackB;
            });

          // Try duplicating items until adding a full stack would increment signal
          for (const itemToDuplicate of availableItems) {
            for (let i = 1; i < optimizedSlots.length; i++) {
              if (optimizedSlots[i] === null) {
                optimizedSlots[i] = { ...itemToDuplicate, originalIndex: -1, forceAdjusted: true };
                const newSignal = calculateSignalStrength(optimizedSlots);
                if (newSignal > currentSignal) {
                  // Keep this stack but set quantity to 1, then Strategy 5 will fine-tune it
                  optimizedSlots[i].quantity = 1;
                  break;
                }
              }
            }
            // Check if we've reached the threshold
            if (calculateSignalStrength(optimizedSlots) > currentSignal) {
              break;
            }
          }
        }
      }
    }

    // Strategy 5: Final increment pass on all forced items from the END
    currentSignal = calculateSignalStrength(optimizedSlots);
    let reachedThreshold = false;
    while (true) {
      let incremented = false;
      for (let i = optimizedSlots.length - 1; i >= 1; i--) {
        if (optimizedSlots[i] && optimizedSlots[i].forceAdjusted === true) {
          const stackLimit = optimizedSlots[i].stack_size || 64;
          if (optimizedSlots[i].quantity < stackLimit) {
            optimizedSlots[i].quantity++;
            const newSignal = calculateSignalStrength(optimizedSlots);
            if (newSignal > currentSignal) {
              optimizedSlots[i].quantity--;
              reachedThreshold = true;
              break;
            }
            incremented = true;
            break;
          }
        }
      }
      if (!incremented || reachedThreshold) break;
    }

    // Recalculate forceAdjusted flags AFTER quantities have been adjusted
    // An item is adjusted if: (1) quantity > 1, OR (2) multiple instances exist
    for (let i = 1; i < optimizedSlots.length; i++) {
      if (optimizedSlots[i]) {
        const hasMultipleInstances = itemCounts[optimizedSlots[i].id] > 1;
        const hasQuantity = (optimizedSlots[i].quantity || 1) > 1;
        optimizedSlots[i].forceAdjusted = hasQuantity || hasMultipleInstances;
      }
    }

    // Organize into adjusted vs unadjusted
    const unadjusted = [];
    const adjusted = [];
    for (let i = 1; i < optimizedSlots.length; i++) {
      if (optimizedSlots[i] !== null) {
        if (optimizedSlots[i].forceAdjusted === true) {
          optimizedSlots[i].isAdjusted = true;
          adjusted.push(optimizedSlots[i]);
        } else {
          optimizedSlots[i].isAdjusted = false;
          unadjusted.push(optimizedSlots[i]);
        }
      }
    }

    // Sort adjusted items
    adjusted.sort((a, b) => {
      const aStack = a.stack_size || 64;
      const bStack = b.stack_size || 64;
      if (aStack === 1 && bStack !== 1) return -1;
      if (aStack !== 1 && bStack === 1) return 1;
      return a.quantity - b.quantity;
    });

    // Calculate null padding
    const nullsNeeded = 53 - unadjusted.length - adjusted.length;
    const result = [null, ...unadjusted];
    for (let i = 0; i < nullsNeeded; i++) {
      result.push(null);
    }
    result.push(...adjusted);

    return result;
  };

  // Calculate HSL color distance between two items
  const getColorDistance = (item1, item2) => {
    if (!item1 || !item2 || !item1.color || !item2.color) return Infinity;

    const hsl1 = item1.color.hsl;
    const hsl2 = item2.color.hsl;

    if (!hsl1 || !hsl2) return Infinity;

    // Hue is circular (0-360 degrees), so we need special distance calculation
    let hueDiff = Math.abs(hsl1[0] - hsl2[0]);
    if (hueDiff > 180) hueDiff = 360 - hueDiff;

    // Normalize hue difference to 0-100 scale (like saturation and luminosity)
    hueDiff = (hueDiff / 180) * 100;

    const satDiff = Math.abs(hsl1[1] - hsl2[1]);
    const lumDiff = Math.abs(hsl1[2] - hsl2[2]);

    // Weighted Euclidean distance (hue is more important for visual similarity)
    return Math.sqrt((hueDiff * 2) ** 2 + satDiff ** 2 + lumDiff ** 2);
  };

  // Sort cell items by color similarity (greedy nearest neighbor)
  const sortCellByColor = (cellId) => {
    saveToHistory();

    setCells(cells.map(cell => {
      if (cell.id !== cellId) return cell;

      // Get all non-null items
      const items = cell.slots.filter(item => item !== null);
      if (items.length <= 1) return cell; // Nothing to sort

      // Greedy nearest neighbor algorithm
      const sorted = [items[0]]; // Start with first item
      const remaining = items.slice(1);

      while (remaining.length > 0) {
        const current = sorted[sorted.length - 1];

        // Find closest item to current
        let closestIndex = 0;
        let closestDistance = getColorDistance(current, remaining[0]);

        for (let i = 1; i < remaining.length; i++) {
          const distance = getColorDistance(current, remaining[i]);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        }

        // Add closest item to sorted list and remove from remaining
        sorted.push(remaining[closestIndex]);
        remaining.splice(closestIndex, 1);
      }

      // Pad with nulls to maintain 53 usable slots
      while (sorted.length < 53) {
        sorted.push(null);
      }

      // Reconstruct with slot 0 as null
      return { ...cell, slots: [null, ...sorted] };
    }));
  };

  // Calculate character similarity between two tokens (used as tiebreaker)
  const getTokenCharacterSimilarity = (token1, token2) => {
    if (token1 === token2) return 1; // Perfect match

    const longer = token1.length > token2.length ? token1 : token2;
    const shorter = token1.length > token2.length ? token2 : token1;

    // Count matching characters
    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) matches++;
    }

    // Normalize to 0-1 range
    return matches / longer.length;
  };

  // Calculate namespace similarity between two items
  // Priority: 1) Same material, 2) Exact token matches, 3) Character similarity
  const getNamespaceSimilarity = (item1, item2) => {
    if (!item1 || !item2 || !item1.id || !item2.id) return { material: 0, tokens: 0, chars: 0 };

    // Check if materials match (highest priority)
    const materialMatch = (item1.material && item2.material && item1.material === item2.material) ? 1 : 0;

    // Split IDs into tokens
    const tokens1 = item1.id.split('_');
    const tokens2 = item2.id.split('_');

    // Count exact token matches (second priority)
    let exactTokenMatches = 0;
    for (const token1 of tokens1) {
      for (const token2 of tokens2) {
        if (token1 === token2) {
          exactTokenMatches++;
        }
      }
    }

    // Calculate character similarity between tokens (tiebreaker)
    let totalCharSimilarity = 0;
    let comparisons = 0;
    for (const token1 of tokens1) {
      for (const token2 of tokens2) {
        totalCharSimilarity += getTokenCharacterSimilarity(token1, token2);
        comparisons++;
      }
    }
    const avgCharSimilarity = comparisons > 0 ? totalCharSimilarity / comparisons : 0;

    return { material: materialMatch, tokens: exactTokenMatches, chars: avgCharSimilarity };
  };

  // Load and parse compound tokens that must stay together
  const [compoundTokens, setCompoundTokens] = useState([]);

  useEffect(() => {
    fetch('stokens.txt?v=' + Date.now())
      .then(response => response.text())
      .then(text => {
        const tokens = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        // Sort by length descending to match longer compounds first
        tokens.sort((a, b) => b.length - a.length);
        setCompoundTokens(tokens);
      })
      .catch(err => console.error('Failed to load compound tokens:', err));
  }, []);

  // Normalize an ID by replacing compound tokens with single units
  const normalizeId = (id, compounds) => {
    let normalized = id;
    const replacements = [];

    compounds.forEach((compound, idx) => {
      if (normalized.includes(compound)) {
        const placeholder = `COMPOUND${idx}`;
        normalized = normalized.replace(new RegExp(compound, 'g'), placeholder);
        replacements.push({ placeholder, original: compound });
      }
    });

    return { normalized, replacements };
  };

  // Denormalize by restoring compound tokens
  const denormalizeId = (id, replacements) => {
    let denormalized = id;
    replacements.forEach(({ placeholder, original }) => {
      denormalized = denormalized.replace(new RegExp(placeholder, 'g'), original);
    });
    return denormalized;
  };

  // Find the best split point for all items in a cell
  // Returns the index where we should split tokens into [prefix tokens] and [suffix tokens]
  const findBestSplitPoint = (items) => {
    if (items.length === 0) return 1;

    // Normalize all IDs first
    const normalized = items.map(item => {
      const { normalized: normId, replacements } = normalizeId(item.id, compoundTokens);
      return { id: normId, replacements };
    });

    // Get all tokenized normalized IDs
    const allTokens = normalized.map(n => n.id.split('_'));
    const maxLength = Math.max(...allTokens.map(t => t.length));

    // Try each possible split point and score it
    let bestSplit = 1; // Default: split after first token
    let bestScore = 0;

    for (let splitIdx = 1; splitIdx < maxLength; splitIdx++) {
      // Count unique prefixes and suffixes at this split point
      const prefixes = new Set();
      const suffixes = new Set();

      allTokens.forEach(tokens => {
        if (tokens.length >= splitIdx) {
          const prefix = tokens.slice(0, splitIdx).join('_');
          const suffix = tokens.slice(splitIdx).join('_');
          if (prefix) prefixes.add(prefix);
          if (suffix) suffixes.add(suffix);
        }
      });

      // Good split: both prefixes and suffixes have variety, and they're balanced
      // Score = min(uniquePrefixes, uniqueSuffixes) to favor balanced splits
      const score = Math.min(prefixes.size, suffixes.size);

      if (score > bestScore) {
        bestScore = score;
        bestSplit = splitIdx;
      }
    }

    return bestSplit;
  };

  // Split an item ID into prefix and suffix based on split point
  // Returns { prefix: string, suffix: string }
  const splitItemId = (item, splitPoint) => {
    if (!item || !item.id) return { prefix: '', suffix: '' };

    // Normalize the ID
    const { normalized, replacements } = normalizeId(item.id, compoundTokens);

    // Split normalized ID
    const tokens = normalized.split('_');
    const prefixNorm = tokens.slice(0, splitPoint).join('_');
    const suffixNorm = tokens.slice(splitPoint).join('_');

    // Denormalize back
    const prefix = denormalizeId(prefixNorm, replacements);
    const suffix = denormalizeId(suffixNorm, replacements);

    return { prefix, suffix };
  };

  // Sort cell items by namespace: groups by prefix, arranges suffixes in sequence
  // Example: [pale_oak_planks, pale_oak_stairs, pale_oak_slab, dark_oak_planks, dark_oak_stairs, dark_oak_slab]
  const sortCellByNamespace = (cellId) => {
    saveToHistory();

    setCells(cells.map(cell => {
      if (cell.id !== cellId) return cell;

      const items = cell.slots.filter(item => item !== null);
      if (items.length <= 1) return cell;

      // Find the best split point for this cell
      const splitPoint = findBestSplitPoint(items);

      // Split all items
      const itemsWithSplit = items.map(item => {
        const { prefix, suffix } = splitItemId(item, splitPoint);
        return { item, prefix, suffix };
      });

      // Group by prefix
      const groups = {};
      itemsWithSplit.forEach(({ item, prefix, suffix }) => {
        const key = prefix || '_no_prefix';
        if (!groups[key]) groups[key] = [];
        groups[key].push({ item, prefix, suffix });
      });

      const sorted = [];

      // Establish pattern from first group
      const firstKey = splitItemId(items[0], splitPoint).prefix || '_no_prefix';
      const firstGroup = groups[firstKey];

      if (firstGroup && firstGroup.length > 0) {
        // Sort first group by similarity, extract suffix pattern
        const firstSorted = [firstGroup[0]];
        const remaining = firstGroup.slice(1);

        while (remaining.length > 0) {
          const current = firstSorted[firstSorted.length - 1];
          let bestIdx = 0;
          let bestSim = getNamespaceSimilarity(current.item, remaining[0].item);

          for (let i = 1; i < remaining.length; i++) {
            const sim = getNamespaceSimilarity(current.item, remaining[i].item);
            if (sim.tokens > bestSim.tokens ||
              (sim.tokens === bestSim.tokens && sim.chars > bestSim.chars)) {
              bestSim = sim;
              bestIdx = i;
            }
          }

          firstSorted.push(remaining[bestIdx]);
          remaining.splice(bestIdx, 1);
        }

        // Extract suffix pattern
        const pattern = firstSorted.map(({ suffix }) => suffix);

        // Add first group
        sorted.push(...firstSorted.map(({ item }) => item));
        delete groups[firstKey];

        // Apply pattern to other groups
        Object.keys(groups).forEach(key => {
          const group = groups[key];
          const groupSorted = [];

          pattern.forEach(pat => {
            const idx = group.findIndex(({ suffix }) => suffix === pat);
            if (idx !== -1) {
              groupSorted.push(group[idx].item);
              group.splice(idx, 1);
            }
          });

          // Add remaining
          groupSorted.push(...group.map(({ item }) => item));
          sorted.push(...groupSorted);
        });
      }

      // Pad with nulls to maintain 53 usable slots
      while (sorted.length < 53) {
        sorted.push(null);
      }

      // Reconstruct with slot 0 as null
      return { ...cell, slots: [null, ...sorted] };
    }));
  };

  // Sort cell items by type: groups by suffix, arranges prefixes in sequence
  // Example: [pale_oak_planks, dark_oak_planks, pale_oak_stairs, dark_oak_stairs]
  const sortCellByType = (cellId) => {
    saveToHistory();

    setCells(cells.map(cell => {
      if (cell.id !== cellId) return cell;

      const items = cell.slots.filter(item => item !== null);
      if (items.length <= 1) return cell;

      // Find the best split point for this cell
      const splitPoint = findBestSplitPoint(items);

      // Split all items
      const itemsWithSplit = items.map(item => {
        const { prefix, suffix } = splitItemId(item, splitPoint);
        return { item, prefix, suffix };
      });

      // Group by suffix (type)
      const groups = {};
      itemsWithSplit.forEach(({ item, prefix, suffix }) => {
        const key = suffix || '_no_suffix';
        if (!groups[key]) groups[key] = [];
        groups[key].push({ item, prefix, suffix });
      });

      const sorted = [];

      // Establish prefix order from first type group
      const firstKey = splitItemId(items[0], splitPoint).suffix || '_no_suffix';
      const firstGroup = groups[firstKey];

      if (firstGroup && firstGroup.length > 0) {
        // Sort first group by similarity, extract prefix order
        const firstSorted = [firstGroup[0]];
        const remaining = firstGroup.slice(1);

        while (remaining.length > 0) {
          const current = firstSorted[firstSorted.length - 1];
          let bestIdx = 0;
          let bestSim = getNamespaceSimilarity(current.item, remaining[0].item);

          for (let i = 1; i < remaining.length; i++) {
            const sim = getNamespaceSimilarity(current.item, remaining[i].item);
            if (sim.tokens > bestSim.tokens ||
              (sim.tokens === bestSim.tokens && sim.chars > bestSim.chars)) {
              bestSim = sim;
              bestIdx = i;
            }
          }

          firstSorted.push(remaining[bestIdx]);
          remaining.splice(bestIdx, 1);
        }

        // Extract prefix order
        const prefixOrder = firstSorted.map(({ prefix }) => prefix);

        // Add first group
        sorted.push(...firstSorted.map(({ item }) => item));
        delete groups[firstKey];

        // Apply prefix order to other suffix groups
        Object.keys(groups).forEach(key => {
          const group = groups[key];
          const groupSorted = [];

          prefixOrder.forEach(pre => {
            const idx = group.findIndex(({ prefix }) => prefix === pre);
            if (idx !== -1) {
              groupSorted.push(group[idx].item);
              group.splice(idx, 1);
            }
          });

          // Add remaining
          groupSorted.push(...group.map(({ item }) => item));
          sorted.push(...groupSorted);
        });
      }

      // Pad with nulls to maintain 53 usable slots
      while (sorted.length < 53) {
        sorted.push(null);
      }

      // Reconstruct with slot 0 as null
      return { ...cell, slots: [null, ...sorted] };
    }));
  };
  const clearSlot = (cellId, slotIndex) => {
    saveToHistory();

    // If there's a selection, clear all selected items
    if (selectedSlots.length > 0) {
      setCells(cells.map(cell => {
        const newSlots = [...cell.slots];
        // Remove all selected items from this cell
        const slotsToRemove = selectedSlots
          .filter(s => s.cellId === cell.id)
          .map(s => s.slotIndex)
          .sort((a, b) => b - a); // Sort descending to remove from end first

        slotsToRemove.forEach(idx => {
          newSlots.splice(idx, 1);
          newSlots.push(null);
        });

        return { ...cell, slots: newSlots };
      }));

      // Clear the selection
      setSelectedSlots([]);
      setLastSelectedSlot(null);
    } else {
      // Single item removal
      setCells(cells.map(cell => {
        if (cell.id === cellId) {
          const newSlots = [...cell.slots];
          // Remove the item at the slot index
          newSlots.splice(slotIndex, 1);
          // Add null at the end to maintain 54 slots
          newSlots.push(null);
          return { ...cell, slots: newSlots };
        }
        return cell;
      }));
    }
  };

  // Toggle display mode and reorder slots for visual consistency
  const toggleDisplayMode = () => {
    const newDisplayMode = !displayMode;

    // Always reorder cells when toggling
    setCells(cells.map(cell => {
      if (newDisplayMode) {
        // Enabling displayMode: reorder to match optimized display
        const optimizedSlots = optimizeForRedstone(cell.slots);

        // Create new slots array that physically matches the optimized order
        // but without the isAdjusted flags and adjusted quantities
        const reorderedSlots = optimizedSlots.map(slot => {
          if (!slot) return null;

          // Create clean copy without optimization metadata
          // But PRESERVE isDuplicate, forceAdjusted, and userSubstituted flags
          const cleanSlot = { ...slot };
          delete cleanSlot.quantity;
          delete cleanSlot.isAdjusted;
          delete cleanSlot.originalIndex;
          // Keep isDuplicate, forceAdjusted, and userSubstituted flags if they exist

          return cleanSlot;
        });

        return { ...cell, slots: reorderedSlots };
      } else {
        // Disabling displayMode: compact items (remove gaps)
        const compactedSlots = [null]; // Slot 0 is always null

        // Collect all non-null items
        for (let i = 1; i < cell.slots.length; i++) {
          if (cell.slots[i] !== null) {
            compactedSlots.push(cell.slots[i]);
          }
        }

        // Fill remaining slots with null
        while (compactedSlots.length < 54) {
          compactedSlots.push(null);
        }

        return { ...cell, slots: compactedSlots };
      }
    }));

    setDisplayMode(newDisplayMode);
  };

  // Substitute an adjusted item with another item in displayMode
  // Works by modifying the RAW cell.slots and letting optimizeForRedstone run on next render
  const substituteAdjustedItem = (cellId, targetDisplayIndex, sourceDisplayIndex) => {
    saveToHistory();

    setCells(cells.map(cell => {
      if (cell.id !== cellId) return cell;

      // Step 1: Get display representation to identify which item user clicked
      const displaySlots = optimizeForRedstone(cell.slots);
      const targetDisplayItem = displaySlots[targetDisplayIndex];
      const sourceDisplayItem = displaySlots[sourceDisplayIndex];

      console.log('=== SUBSTITUTION ATTEMPT ===');
      console.log('Target:', targetDisplayItem?.id, 'isAdjusted:', targetDisplayItem?.isAdjusted, 'stack_size:', targetDisplayItem?.stack_size);
      console.log('Source:', sourceDisplayItem?.id, 'isAdjusted:', sourceDisplayItem?.isAdjusted, 'stack_size:', sourceDisplayItem?.stack_size);

      // Verify target is adjusted
      if (!targetDisplayItem || !targetDisplayItem.isAdjusted) {
        console.log('REJECTED: Target not adjusted');
        return cell;
      }

      // Mark all currently adjusted items with forceAdjusted flag
      // This prevents re-optimization after substitution
      console.log('Marking adjusted items with forceAdjusted:');
      for (let i = 1; i < displaySlots.length; i++) {
        if (displaySlots[i] && displaySlots[i].isAdjusted && displaySlots[i].originalIndex >= 0) {
          const origIdx = displaySlots[i].originalIndex;
          if (cell.slots[origIdx]) {
            console.log('  Marking', cell.slots[origIdx].id, 'at raw position', origIdx, '(display position', i, ')');
            cell.slots[origIdx] = { ...cell.slots[origIdx], forceAdjusted: true };
          }
        }
      }

      // Step 2: Work with raw slots - make a copy
      const newSlots = [...cell.slots];
      console.log('Items with forceAdjusted in newSlots:', newSlots.filter((s, i) => i > 0 && s && s.forceAdjusted).map(s => s.id));

      // Step 3: Build a precise mapping from display items to actual slots
      // Track which actual indices we've already matched to handle duplicates
      const usedIndices = new Set();

      const findActualIndexForDisplay = (displayItem) => {
        // For items with originalIndex >= 0, use it directly
        if (displayItem.originalIndex !== undefined && displayItem.originalIndex >= 0) {
          usedIndices.add(displayItem.originalIndex);
          return displayItem.originalIndex;
        }

        // For duplicated items (originalIndex === -1 or undefined), match by ID
        // Find all raw slots with matching ID that haven't been used yet
        for (let i = 1; i < newSlots.length; i++) {
          if (newSlots[i] && newSlots[i].id === displayItem.id && !usedIndices.has(i)) {
            usedIndices.add(i);
            return i;
          }
        }

        return -1;
      };

      const targetActualIndex = findActualIndexForDisplay(targetDisplayItem);
      const sourceActualIndex = findActualIndexForDisplay(sourceDisplayItem);

      console.log('Display → Actual mapping:');
      console.log('  Target display index:', targetDisplayIndex, '→ actual index:', targetActualIndex);
      console.log('  Source display index:', sourceDisplayIndex, '→ actual index:', sourceActualIndex);
      console.log('  Target item in newSlots[' + targetActualIndex + ']:', newSlots[targetActualIndex]?.id);
      console.log('  Source item in newSlots[' + sourceActualIndex + ']:', newSlots[sourceActualIndex]?.id);

      if (targetActualIndex === -1) {
        console.log('REJECTED: Target actual index not found');
        return cell;
      }

      // Case 1: Source is also adjusted (duplication case)
      if (sourceDisplayItem && sourceDisplayItem.isAdjusted) {
        console.log('=== DUPLICATION CASE ===');
        console.log('Source item:', sourceDisplayItem.id, 'at display index', sourceDisplayIndex, 'actual index', sourceActualIndex);
        console.log('Target item:', targetDisplayItem.id, 'at display index', targetDisplayIndex, 'actual index', targetActualIndex);
        console.log('Source isAdjusted:', sourceDisplayItem.isAdjusted, 'quantity:', sourceDisplayItem.quantity);
        console.log('Target isAdjusted:', targetDisplayItem.isAdjusted, 'quantity:', targetDisplayItem.quantity);

        // Special case: If source and target are the same item, compact them instead of duplicating
        if (sourceDisplayItem.id === targetDisplayItem.id) {
          console.log('SAME ITEM - Compacting');
          // Combine all instances of this item into one
          const itemId = sourceDisplayItem.id;
          const stackSize = sourceDisplayItem.stack_size || 64;

          // Count total instances and collect their positions
          const positions = [];
          for (let i = 1; i < newSlots.length; i++) {
            if (newSlots[i] && newSlots[i].id === itemId) {
              positions.push(i);
            }
          }

          console.log('Found', positions.length, 'instances of', itemId, 'at positions:', positions);
          console.log('Stack size:', stackSize);

          // If stackable, consolidate into minimum number of stacks
          if (stackSize > 1) {
            const totalCount = positions.length; // Each instance is quantity 1 in raw slots
            const fullStacks = Math.floor(totalCount / stackSize);
            const remainder = totalCount % stackSize;

            console.log('Consolidating into', fullStacks, 'full stacks +', remainder, 'remainder');

            // Create clean base item
            const baseItem = { ...newSlots[positions[0]] };
            delete baseItem.quantity;
            delete baseItem.isAdjusted;
            delete baseItem.originalIndex;
            delete baseItem.forceAdjusted;

            // Remove all instances
            for (let i = positions.length - 1; i >= 0; i--) {
              newSlots.splice(positions[i], 1);
            }

            // Add back consolidated stacks at the end
            for (let i = 0; i < fullStacks; i++) {
              newSlots.push({ ...baseItem, forceAdjusted: true });
            }
            if (remainder > 0) {
              newSlots.push({ ...baseItem, forceAdjusted: true });
            }

            // Fill to maintain 54 slots
            while (newSlots.length < 54) {
              newSlots.push(null);
            }

            console.log('After compaction, slot count:', newSlots.filter(s => s !== null).length);
          }
          // If unstackable, keep as is (already marked with forceAdjusted)

          return { ...cell, slots: newSlots };
        }

        // Normal duplication: different items
        console.log('DIFFERENT ITEMS - Duplicating');
        console.log('Before duplication - total items:', newSlots.filter((s, i) => i > 0 && s !== null).length);

        // Create clean copies without optimization metadata
        const baseSource = { ...newSlots[sourceActualIndex] };
        delete baseSource.quantity;
        delete baseSource.isAdjusted;
        delete baseSource.originalIndex;
        delete baseSource.forceAdjusted;
        // Mark as forceAdjusted to keep it in adjusted group
        baseSource.forceAdjusted = true;

        const baseTarget = { ...newSlots[targetActualIndex] };
        delete baseTarget.quantity;
        delete baseTarget.isAdjusted;
        delete baseTarget.originalIndex;
        delete baseTarget.forceAdjusted; // Remove from adjusted group when moving back to cell

        console.log('Base source (with forceAdjusted):', baseSource.id, baseSource.forceAdjusted);
        console.log('Base target (no forceAdjusted):', baseTarget.id, baseTarget.forceAdjusted);

        // Ensure source has forceAdjusted flag (in case it wasn't already marked)
        if (!newSlots[sourceActualIndex].forceAdjusted) {
          newSlots[sourceActualIndex] = { ...newSlots[sourceActualIndex], forceAdjusted: true };
        }
        // Replace target with a copy of source (creates duplicate at target position)
        newSlots[targetActualIndex] = { ...baseSource };

        console.log('After replacing target with source copy');
        console.log('Items with forceAdjusted:', newSlots.filter((s, i) => i > 0 && s !== null && s.forceAdjusted).length);

        // Find the first null slot BEFORE the adjusted items to place the displaced target
        // We want it in the unadjusted section
        let insertPosition = -1;
        for (let i = 1; i < newSlots.length; i++) {
          if (newSlots[i] === null) {
            insertPosition = i;
            break;
          }
        }

        console.log('Insert displaced target at first null position:', insertPosition);

        // If we found a null position, place the displaced target there
        if (insertPosition !== -1) {
          newSlots[insertPosition] = baseTarget;
        } else {
          // No room - this shouldn't happen in normal use, but log it
          console.warn('No room to place displaced target!');
        }

        console.log('After duplication - total items:', newSlots.filter((s, i) => i > 0 && s !== null).length);
        console.log('Items with forceAdjusted:', newSlots.filter((s, i) => i > 0 && s !== null && s.forceAdjusted).length);
      }
      // Case 2: Source is unadjusted
      else if (sourceActualIndex !== -1) {
        console.log('=== CASE 2: Source is unadjusted ===');
        // Check if target item appears multiple times (is a duplicate)
        const targetId = targetDisplayItem.id;
        const targetCount = newSlots.filter(s => s && s.id === targetId).length;

        console.log('Target count:', targetCount, 'Target ID:', targetId);

        if (targetCount > 1) {
          console.log('Target is DUPLICATED - Case 2a');
          // Target is duplicated
          const targetStackSize = targetDisplayItem.stack_size || 64;
          const sourceStackSize = sourceDisplayItem.stack_size || 64;

          // Check if both are unstackables
          if (targetStackSize === 1 && sourceStackSize === 1) {
            // Replace ALL instances of target unstackable with source
            const baseSource = { ...newSlots[sourceActualIndex] };
            delete baseSource.quantity;
            delete baseSource.isAdjusted;
            delete baseSource.originalIndex;

            // Save one instance of the target to place back in cell
            const baseTarget = { ...newSlots[targetActualIndex] };
            delete baseTarget.quantity;
            delete baseTarget.isAdjusted;
            delete baseTarget.originalIndex;
            delete baseTarget.forceAdjusted;
            delete baseTarget.isDuplicate;

            const sourceId = baseSource.id;

            // Remove source FIRST (before replacement) to avoid confusion
            newSlots.splice(sourceActualIndex, 1);
            newSlots.push(null); // Add null at end to maintain 54 slots

            // Now find and replace all instances of target (avoiding the source item we just removed)
            for (let i = 1; i < newSlots.length; i++) {
              if (newSlots[i] && newSlots[i].id === targetId) {
                // Preserve isDuplicate and forceAdjusted flags
                const wasDuplicate = newSlots[i].isDuplicate;
                const wasForceAdjusted = newSlots[i].forceAdjusted;
                newSlots[i] = { ...baseSource };
                if (wasDuplicate) {
                  newSlots[i].isDuplicate = true;
                }
                if (wasForceAdjusted) {
                  newSlots[i].forceAdjusted = true;
                }
              }
            }

            // Place the displaced target in the first available null slot
            for (let i = 1; i < newSlots.length; i++) {
              if (newSlots[i] === null) {
                newSlots[i] = baseTarget;
                break;
              }
            }
          } else {
            // Regular duplicate case - just replace the one we dropped onto
            const baseSource = { ...newSlots[sourceActualIndex] };
            delete baseSource.quantity;
            delete baseSource.isAdjusted;
            delete baseSource.originalIndex;

            newSlots[targetActualIndex] = baseSource;

            // Remove source by splicing to close the gap
            newSlots.splice(sourceActualIndex, 1);
            newSlots.push(null); // Add null at end to maintain 54 slots
          }
        } else {
          console.log('Target is UNIQUE - Case 2b (swap)');
          console.log('Target actual index:', targetActualIndex);
          console.log('Source actual index:', sourceActualIndex);

          // Target is unique - swap source and target positions directly

          // Save both items
          const baseTarget = { ...newSlots[targetActualIndex] };
          const targetQuantity = baseTarget.quantity; // Save target's quantity
          delete baseTarget.quantity;
          delete baseTarget.isAdjusted;
          delete baseTarget.originalIndex;

          const baseSource = { ...newSlots[sourceActualIndex] };
          delete baseSource.quantity;
          delete baseSource.isAdjusted;
          delete baseSource.originalIndex;

          console.log('Base target:', baseTarget.id, 'forceAdjusted:', baseTarget.forceAdjusted, 'quantity:', targetQuantity);
          console.log('Base source:', baseSource.id, 'forceAdjusted:', baseSource.forceAdjusted);

          // Source goes to target position and becomes adjusted (takes target's place in adjusted group)
          // Mark as user-substituted to prevent re-optimization from changing it
          baseSource.userSubstituted = true;
          baseSource.forceAdjusted = true;
          // Give source the same quantity that target had (if any)
          if (targetQuantity && targetQuantity > 1) {
            baseSource.quantity = targetQuantity;
          }
          // Target goes to source position in unadjusted section
          delete baseTarget.forceAdjusted;
          delete baseTarget.userSubstituted;

          // Simple swap: source goes to target position, target goes to source position
          newSlots[targetActualIndex] = baseSource;
          newSlots[sourceActualIndex] = baseTarget;

          console.log('After swap - position', targetActualIndex, ':', newSlots[targetActualIndex].id, 'forceAdjusted:', newSlots[targetActualIndex].forceAdjusted);
          console.log('After swap - position', sourceActualIndex, ':', newSlots[sourceActualIndex].id, 'forceAdjusted:', newSlots[sourceActualIndex].forceAdjusted);
          console.log('Total items with forceAdjusted:', newSlots.filter((s, i) => i > 0 && s && s.forceAdjusted).length);
        }
      }

      return { ...cell, slots: newSlots };
    }));
  };

  // Cell drag handlers
  const handleCellDragStart = (e, cellId) => {
    const isFromHeader = e.target.closest('.cell-drag-handle') !== null;
    if (!isFromHeader) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setDraggedCell(cellId);
    e.currentTarget.classList.add('dragging-cell');
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCellDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging-cell');
    setDraggedCell(null);
    setDragOverCell(null);
  };

  const handleCellDragOver = (e, cellId) => {
    // Skip if not dragging a cell
    if (!draggedCell) return;

    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling from child elements

    // Update state only if dragging over a different cell
    if (draggedCell !== cellId && dragOverCell !== cellId) {
      setDragOverCell(cellId);
    }
  };

  const handleCellDragLeave = (e, cellId) => {
    // Skip if not dragging a cell
    if (!draggedCell) return;

    // Clear drag over state
    if (dragOverCell === cellId) {
      setDragOverCell(null);
    }
  };

  const handleCellDrop = (e, targetCellId) => {
    e.preventDefault();
    setDragOverCell(null);

    // If dragging a cell (reordering cells)
    if (draggedCell && draggedCell !== targetCellId) {
      // Clone cells efficiently using structured clone or simple spread
      const cellsSnapshot = cells.map(cell => ({
        ...cell,
        slots: [...cell.slots]
      }));

      const newHistory = [...history, cellsSnapshot];
      if (newHistory.length > 10) {
        newHistory.shift();
      }
      setHistory(newHistory);

      const draggedIndex = cells.findIndex(c => c.id === draggedCell);
      const targetIndex = cells.findIndex(c => c.id === targetCellId);

      const newCells = [...cells];
      const [removed] = newCells.splice(draggedIndex, 1);
      newCells.splice(targetIndex, 0, removed);

      setCells(newCells);
      setDraggedCell(null);
      return;
    }

    // If dragging an item (from catalogue or slot), add it to the end of the cell
    if (draggedItem || draggedSlot) {
      // Find first empty slot in the cell (starting from slot 1 to skip reserved slot 0)
      const targetCell = cells.find(c => c.id === targetCellId);
      let firstEmptySlotIndex = -1;
      for (let i = 1; i < targetCell.slots.length; i++) {
        if (targetCell.slots[i] === null) {
          firstEmptySlotIndex = i;
          break;
        }
      }

      // If no empty slot, use the last slot (will push items out)
      const dropSlotIndex = firstEmptySlotIndex !== -1 ? firstEmptySlotIndex : targetCell.slots.length - 1;

      // Delegate to handleItemDrop
      handleItemDrop(e, targetCellId, dropSlotIndex);
    }

    setDraggedCell(null);
  };

  return (
    <div className="flex h-screen bg-stone-800 text-stone-100">
      {loading ? (
        <div className="flex items-center justify-center w-full">
          <div className="text-amber-400 text-xl">Loading items...</div>
        </div>
      ) : (
        <>
          {/* Catalogue Sidebar */}
          <div style={{ width: `${catalogueWidth}px` }} className="bg-stone-900 flex flex-col">
            <div className="p-4 border-b-2 border-stone-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-amber-400">Item Catalogue</h2>
                <div className="text-xs text-stone-400">
                  {availableItems.length} / {catalogueItems.length}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {availableItems.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableItems.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleItemDragStart(e, item, { type: 'catalogue' })}
                      onDragEnd={handleItemDragEnd}
                      className="bg-stone-800 border-2 border-stone-600 p-2 rounded cursor-grab active:cursor-grabbing hover:border-amber-600 transition-colors"
                      title={item.name}
                    >
                      <img
                        src={item.sprite}
                        alt={item.name}
                        className="w-8 h-8 mx-auto pixelated pointer-events-none"
                      />
                      <div className="text-xs text-center mt-1 truncate pointer-events-none">{item.name}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-stone-500 mt-8">
                  <p className="text-sm">
                    {searchTerm ? 'No items match your search' : 'All items assigned!'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Draggable Divider */}
          <div
            onMouseDown={() => setIsDraggingDivider(true)}
            className="w-1 bg-stone-700 hover:bg-amber-600 cursor-col-resize transition-colors"
            style={{ userSelect: 'none' }}
          />

          {/* Main Workspace and Filter Panel Container */}
          <div className="flex-1 flex flex-col">
            {/* Filter Panel */}
            <div className="bg-stone-900 border-b-2 border-stone-700 p-4">
              <div className="flex items-center gap-4">
                {/* Move All Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={moveAllMode}
                    onChange={(e) => setMoveAllMode(e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-amber-500"
                  />
                  <span className="text-sm text-stone-300">Move All</span>
                </label>

                {/* Search */}
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500">


                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-1.5 bg-stone-800 border border-stone-600 rounded focus:outline-none focus:border-amber-600 text-sm"
                  />
                </div>

                {/* Advanced Filters Toggle */}
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${showColorPicker ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}
                  title="Advanced Filters"
                >
                  Advanced Filters
                </button>

                {/* Undo Button */}
                <button
                  onClick={undo}
                  className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 rounded text-xs transition-colors whitespace-nowrap"
                  title="Undo last action"
                >
                  Undo
                </button>

                {/* Export Button */}
                <button
                  onClick={exportCells}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 rounded text-xs transition-colors whitespace-nowrap"
                  title="Export cells to JSON"
                >
                  Export
                </button>

                {/* Import Button */}
                <label className="px-3 py-1.5 bg-green-700 hover:bg-green-600 rounded text-xs transition-colors whitespace-nowrap cursor-pointer" title="Import cells from JSON">
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importCells}
                    className="hidden"
                  />
                </label>

                {/* Cell Counter */}
                <div className="px-3 py-1.5 bg-stone-900 rounded text-xs text-stone-300 whitespace-nowrap">
                  Cells: {cells.length}
                </div>

                {/* Display Mode Toggle */}
                <button
                  onClick={toggleDisplayMode}
                  className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap text-xs ${displayMode ? 'bg-red-600 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}
                  title={displayMode ? "Redstone Mode: Optimized for signal strength" : "Normal Mode"}
                >
                  {displayMode ? 'Redstone Mode' : 'Normal Mode'}
                </button>
              </div>

              {/* Advanced Filters Panel */}
              {showColorPicker && (
                <div className="mt-4 p-4 bg-stone-800 rounded overflow-visible">
                  <div className="flex gap-6 overflow-visible">
                    {/* Left side: Tag Filters */}
                    <div className="flex flex-col gap-3 min-w-[200px] overflow-visible">
                      <div className="text-sm font-semibold text-amber-400 mb-1">Tag Filters</div>

                      {/* Category Filter */}
                      <div className="relative z-50">
                        <input
                          type="text"
                          placeholder="Category..."
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          onFocus={() => setShowCategorySuggestions(true)}
                          onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                          className="w-full px-3 py-1.5 bg-stone-700 border border-stone-600 rounded focus:outline-none focus:border-amber-600 text-sm"
                        />
                        {showCategorySuggestions && !tagSuggestions.categories.some(cat => cat.toLowerCase() === categoryFilter.toLowerCase()) && (
                          <div className="absolute z-50 w-full mt-1 bg-stone-700 border border-stone-600 rounded shadow-lg max-h-96 overflow-y-auto">
                            {tagSuggestions.categories
                              .filter(cat => !categoryFilter || cat.toLowerCase().includes(categoryFilter.toLowerCase()))
                              .map(cat => (
                                <div
                                  key={cat}
                                  onClick={() => {
                                    setCategoryFilter(cat);
                                    setShowCategorySuggestions(false);
                                  }}
                                  className="px-3 py-1.5 hover:bg-stone-600 cursor-pointer text-sm"
                                >
                                  {cat}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Group Filter */}
                      <div className="relative z-40">
                        <input
                          type="text"
                          placeholder="Group..."
                          value={groupFilter}
                          onChange={(e) => setGroupFilter(e.target.value)}
                          onFocus={() => setShowGroupSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowGroupSuggestions(false), 200)}
                          className="w-full px-3 py-1.5 bg-stone-700 border border-stone-600 rounded focus:outline-none focus:border-amber-600 text-sm"
                        />
                        {showGroupSuggestions && !tagSuggestions.groups.some(grp => grp.toLowerCase() === groupFilter.toLowerCase()) && (
                          <div className="absolute z-50 w-full mt-1 bg-stone-700 border border-stone-600 rounded shadow-lg max-h-96 overflow-y-auto">
                            {tagSuggestions.groups
                              .filter(grp => !groupFilter || grp.toLowerCase().includes(groupFilter.toLowerCase()))
                              .map(grp => (
                                <div
                                  key={grp}
                                  onClick={() => {
                                    setGroupFilter(grp);
                                    setShowGroupSuggestions(false);
                                  }}
                                  className="px-3 py-1.5 hover:bg-stone-600 cursor-pointer text-sm"
                                >
                                  {grp}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Material Filter */}
                      <div className="relative z-30">
                        <input
                          type="text"
                          placeholder="Material..."
                          value={materialFilter}
                          onChange={(e) => setMaterialFilter(e.target.value)}
                          onFocus={() => setShowMaterialSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowMaterialSuggestions(false), 200)}
                          className="w-full px-3 py-1.5 bg-stone-700 border border-stone-600 rounded focus:outline-none focus:border-amber-600 text-sm"
                        />
                        {showMaterialSuggestions && !tagSuggestions.materials.some(mat => mat.toLowerCase() === materialFilter.toLowerCase()) && (
                          <div className="absolute z-50 w-full mt-1 bg-stone-700 border border-stone-600 rounded shadow-lg max-h-96 overflow-y-auto">
                            {tagSuggestions.materials
                              .filter(mat => !materialFilter || mat.toLowerCase().includes(materialFilter.toLowerCase()))
                              .map(mat => (
                                <div
                                  key={mat}
                                  onClick={() => {
                                    setMaterialFilter(mat);
                                    setShowMaterialSuggestions(false);
                                  }}
                                  className="px-3 py-1.5 hover:bg-stone-600 cursor-pointer text-sm"
                                >
                                  {mat}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Stack Size Filter */}
                    <div className="mt-2">
                      <div className="text-sm font-semibold text-amber-400 mb-1">Stack Size</div>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stackSizeFilters[1]}
                            onChange={(e) => setStackSizeFilters({ ...stackSizeFilters, 1: e.target.checked })}
                            className="w-4 h-4 cursor-pointer accent-amber-500"
                          />
                          <span className="text-sm text-stone-300">Unstackable</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stackSizeFilters[16]}
                            onChange={(e) => setStackSizeFilters({ ...stackSizeFilters, 16: e.target.checked })}
                            className="w-4 h-4 cursor-pointer accent-amber-500"
                          />
                          <span className="text-sm text-stone-300">16-stackable</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stackSizeFilters[64]}
                            onChange={(e) => setStackSizeFilters({ ...stackSizeFilters, 64: e.target.checked })}
                            className="w-4 h-4 cursor-pointer accent-amber-500"
                          />
                          <span className="text-sm text-stone-300">64-stackable</span>
                        </label>
                      </div>
                    </div>

                    {/* Middle: Rarity Filter */}
                    <div className="mt-2">
                      <div className="text-sm font-semibold text-amber-400 mb-1">Rarity</div>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rarityFilters["common"]}
                            onChange={(e) => setRarityFilters({ ...rarityFilters, "common": e.target.checked })}
                            className="w-4 h-4 cursor-pointer accent-amber-500"
                          />
                          <span className="text-sm text-stone-300">Common</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rarityFilters["uncommon"]}
                            onChange={(e) => setRarityFilters({ ...rarityFilters, "uncommon": e.target.checked })}
                            className="w-4 h-4 cursor-pointer accent-amber-500"
                          />
                          <span className="text-sm text-stone-300">Uncommon</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rarityFilters["rare"]}
                            onChange={(e) => setRarityFilters({ ...rarityFilters, "rare": e.target.checked })}
                            className="w-4 h-4 cursor-pointer accent-amber-500"
                          />
                          <span className="text-sm text-stone-300">Rare</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rarityFilters["epic"]}
                            onChange={(e) => setRarityFilters({ ...rarityFilters, "epic": e.target.checked })}
                            className="w-4 h-4 cursor-pointer accent-amber-500"
                          />
                          <span className="text-sm text-stone-300">Epic</span>
                        </label>
                      </div>
                    </div>

                    {/* Stats Sorting */}
                    <div className="mt-2">
                      <div className="text-sm font-semibold text-amber-400 mb-1">Player Stats Sort</div>
                      <div className="flex gap-4">
                        {/* Radio buttons on the left */}
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="file" accept=".json" onChange={importStats} className="hidden" id="stats-import" />
                            <label htmlFor="stats-import" className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 rounded text-xs transition-colors whitespace-nowrap cursor-pointer">
                              {playerStats ? 'Stats Loaded ✓' : 'Import Stats'}
                            </label>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="statsSort"
                              checked={statsSortMode === 'none'}
                              onChange={() => setStatsSortMode('none')}
                              className="w-4 h-4 cursor-pointer accent-amber-500"
                            />
                            <span className="text-sm text-stone-300">None</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="statsSort"
                              checked={statsSortMode === 'used'}
                              onChange={() => setStatsSortMode('used')}
                              disabled={!playerStats}
                              className="w-4 h-4 cursor-pointer accent-amber-500 disabled:opacity-50"
                            />
                            <span className={`text-sm ${playerStats ? 'text-stone-300' : 'text-stone-500'}`}>By Used</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="statsSort"
                              checked={statsSortMode === 'crafted'}
                              onChange={() => setStatsSortMode('crafted')}
                              disabled={!playerStats}
                              className="w-4 h-4 cursor-pointer accent-amber-500 disabled:opacity-50"
                            />
                            <span className={`text-sm ${playerStats ? 'text-stone-300' : 'text-stone-500'}`}>By Crafted</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="statsSort"
                              checked={statsSortMode === 'acquired'}
                              onChange={() => setStatsSortMode('acquired')}
                              disabled={!playerStats}
                              className="w-4 h-4 cursor-pointer accent-amber-500 disabled:opacity-50"
                            />
                            <span className={`text-sm ${playerStats ? 'text-stone-300' : 'text-stone-500'}`}>By Possession</span>
                          </label>
                        </div>

                        {/* Stats Percentage Range Slider on the right */}
                        {statsSortMode !== 'none' && playerStats && (
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-xs text-stone-400">Range %</div>
                            <div className="relative flex items-center gap-1" style={{ height: '140px' }}>
                              {/* Range indicator box */}
                              <div
                                className="absolute border border-amber-500 pointer-events-none"
                                style={{
                                  left: '-4px',
                                  right: '-4px',
                                  top: `${((1 - statsPercentRange[1] / 100) * 100 * 128 / 140)}px`,
                                  bottom: `${statsPercentRange[0] === null ? 0 : ((statsPercentRange[0] / 100) * 128 + 12)}px`
                                }}
                              ></div>

                              {/* Left handle for min value */}
                              <div
                                className="w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize z-20 hover:bg-amber-400 transition-colors border-2 border-black"
                                style={{
                                  position: 'absolute',
                                  left: '-4px',
                                  top: `${statsPercentRange[0] === null ? 134 : ((1 - statsPercentRange[0] / 100) * 128)}px`,
                                  transform: 'translateY(-50%)'
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  const container = e.currentTarget.parentElement;
                                  const rect = container.getBoundingClientRect();
                                  const handleMove = (moveEvent) => {
                                    const y = moveEvent.clientY - rect.top;
                                    // Container is 140px: 128px for 0-100 range + 12px NA block at bottom
                                    const sliderHeight = 128;
                                    const naBlockHeight = 12;
                                    let value;

                                    if (y > sliderHeight + naBlockHeight / 2) {
                                      // In NA zone (bottom 12px block)
                                      value = null;
                                    } else if (y > sliderHeight - 2) {
                                      // Snap zone near boundary between 0 and NA
                                      value = 0;
                                    } else {
                                      // Normal 0-100 range (top 128px)
                                      const rawValue = (1 - y / sliderHeight) * 100;
                                      value = Math.max(0, Math.min(100, Math.round(rawValue)));
                                    }

                                    const maxVal = statsPercentRange[1];
                                    if (value === null || value < maxVal) {
                                      setStatsPercentRange([value, maxVal]);
                                    }
                                  };
                                  const handleUp = () => {
                                    document.removeEventListener('mousemove', handleMove);
                                    document.removeEventListener('mouseup', handleUp);
                                  };
                                  handleMove(e);
                                  document.addEventListener('mousemove', handleMove);
                                  document.addEventListener('mouseup', handleUp);
                                }}
                              ></div>

                              {/* Slider track */}
                              <div className="relative w-6 flex flex-col" style={{ height: '140px' }}>
                                {/* 0-100 range (128px) */}
                                <div className="relative rounded-t overflow-hidden" style={{ height: '128px' }}>
                                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-900"></div>
                                </div>
                                {/* NA block (12px) */}
                                <div className="relative rounded-b overflow-hidden bg-gray-700" style={{ height: '12px' }}>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-gray-400">NA</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right handle for max value */}
                              <div
                                className="w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize z-20 hover:bg-amber-400 transition-colors border-2 border-black"
                                style={{
                                  position: 'absolute',
                                  right: '-4px',
                                  top: `${((1 - statsPercentRange[1] / 100) * 128)}px`,
                                  transform: 'translateY(-50%)'
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  const container = e.currentTarget.parentElement;
                                  const rect = container.getBoundingClientRect();
                                  const handleMove = (moveEvent) => {
                                    const y = Math.max(0, Math.min(128, moveEvent.clientY - rect.top));
                                    const sliderHeight = 128;
                                    const value = Math.round((1 - y / sliderHeight) * 100);
                                    const minVal = statsPercentRange[0] === null ? 0 : statsPercentRange[0];
                                    setStatsPercentRange([statsPercentRange[0], Math.max(value, minVal)]);
                                  };
                                  const handleUp = () => {
                                    document.removeEventListener('mousemove', handleMove);
                                    document.removeEventListener('mouseup', handleUp);
                                  };
                                  handleMove(e);
                                  document.addEventListener('mousemove', handleMove);
                                  document.addEventListener('mouseup', handleUp);
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-stone-400 w-12 text-center">{statsPercentRange[0] === null ? 'NA' : statsPercentRange[0]}-{statsPercentRange[1]}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                        <div className="text-sm font-semibold text-amber-400 mb-1">Search Settings</div>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={useRegex}
                                    onChange={(e) => setUseRegex(e.target.checked)}
                                    className="w-4 h-4 cursor-pointer accent-amber-500"
                                />
                                <span className="text-sm text-stone-300">Use regex for search</span>
                            </label>
                        </div>
                    </div>
                    {/* Right side: Color Picker */}
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-sm font-semibold text-amber-400 mb-2">Color Filter</div>
                      <HueRangePicker
                        hueRange={hueRange}
                        satRange={satRange}
                        lumRange={lumRange}
                        onHueChange={setHueRange}
                        onSatChange={setSatRange}
                        onLumChange={setLumRange}
                      />
                      
                      {/* Reset Color Filter Button */}
                      <button
                        onClick={() => {
                          setHueRange([0, 360]);
                          setSatRange([0, 100]);
                          setLumRange([0, 100]);
                        }}
                        className="mt-2 px-3 py-1.5 bg-stone-700 hover:bg-stone-600 rounded text-xs transition-colors whitespace-nowrap"
                      >
                        Reset Color
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Workspace */}
            <div className="flex-1 p-6 overflow-auto" onClick={handleBackgroundClick}>
              <div className="flex flex-wrap gap-6">
                {cells.map((cell, cellIndex) => {
                  const isDragOverThisCell = dragOverCell === cell.id;
                  const displaySlots = displayMode ? optimizeForRedstone(cell.slots) : cell.slots;
                  const signalStrength = displayMode ? calculateSignalStrength(displaySlots) : null;

                  return (
                    <div
                      key={cell.id}
                      className={`bg-stone-900 border-2 rounded-lg p-4 cell-container transition-all ${isDragOverThisCell ? 'border-amber-500' : displayMode ? 'border-red-700' : 'border-stone-700'
                        }`}
                      draggable={false}
                      onDragOver={(e) => handleCellDragOver(e, cell.id)}
                      onDragLeave={(e) => handleCellDragLeave(e, cell.id)}
                      onDrop={(e) => handleCellDrop(e, cell.id)}
                    >
                      <div
                        className="flex justify-between items-center mb-3 min-w-max cell-drag-handle"
                        draggable={!displayMode}
                        onDragStart={(e) => !displayMode && handleCellDragStart(e, cell.id)}
                        onDragEnd={!displayMode ? handleCellDragEnd : undefined}
                      >
                        <div className={`flex items-center gap-2 ${displayMode ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}>


                          <GripIcon />
                          <span className="text-sm text-stone-400">
                            {cell.slots.filter(s => s !== null).length}/53
                            {displayMode && <span className="ml-2 text-red-400">SS: {signalStrength}</span>}
                          </span>
                        </div>
                        {!displayMode && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sortCellByColor(cell.id);
                              }}
                              className="text-amber-400 hover:text-amber-300 transition-colors"
                              title="Sort by color similarity"
                            >

                              <ColorSortIcon />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sortCellByNamespace(cell.id);
                              }}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="Sort by namespace similarity (materials grouped, types in sequence)"
                            >
                              <NamespaceSortIcon />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sortCellByType(cell.id);
                              }}
                              className="text-purple-400 hover:text-purple-300 transition-colors"
                              title="Sort by type similarity (types grouped, materials in sequence)"
                            >
                              <TypeSortIcon />
                            </button>
                            <button
                              onClick={() => removeCell(cell.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Remove cell"
                            >
                              <XIcon />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 6x9 Grid (54 slots, first slot reserved) */}
                      <div
                        className="inline-grid grid-cols-9 gap-1 bg-stone-800 p-2 rounded"
                        style={draggedCell ? { pointerEvents: 'none' } : {}}
                      >
                        {displaySlots.map((slot, slotIndex) => {
                          const slotKey = `${cell.id}-${slotIndex}`;
                          const isDragOver = dragOverSlot === slotKey;
                          const isSelected = selectedSlots.some(s => s.cellId === cell.id && s.slotIndex === slotIndex);
                          const isReserved = slotIndex === 0; // First slot is reserved
                          const quantity = slot?.quantity || 1;
                          const isAdjusted = displayMode && slot?.isAdjusted;

                          return (
                            <div
                              key={slotIndex}
                              draggable={!isReserved && !!slot}
                              onDragStart={(e) => !isReserved && slot && handleItemDragStart(e, slot, { type: 'slot', cellId: cell.id, slotIndex })}
                              onDragEnd={!isReserved ? handleItemDragEnd : undefined}
                              onDragOver={(e) => !isReserved && handleItemDragOver(e, cell.id, slotIndex)}
                              onDragLeave={!isReserved ? handleItemDragLeave : undefined}
                              onDrop={(e) => !isReserved && handleItemDrop(e, cell.id, slotIndex)}
                              onClick={(e) => {
                                if (displayMode || isReserved) return;
                                e.stopPropagation();
                                if (slot) {
                                  handleSlotClick(e, cell.id, slotIndex, slot);
                                } else {
                                  // Clicking empty slot clears selection
                                  handleBackgroundClick();
                                }
                              }}

                              className={`w-12 h-12 border rounded flex items-center justify-center transition-colors relative group ${isReserved
                                ? 'bg-stone-900 border-stone-800 cursor-not-allowed opacity-50'
                                : displayMode
                                  ? `${isDragOver && isAdjusted
                                    ? 'bg-stone-800 border-amber-500'
                                    : `bg-stone-700 ${isAdjusted ? 'border-2 border-red-500 shadow-red-500/50 shadow-md' : 'border-stone-600'}`
                                  } ${slot ? 'cursor-grab active:cursor-grabbing' : ''}`
                                  : `${isDragOver
                                    ? 'bg-stone-800 border-amber-500'
                                    : `bg-stone-700 ${isSelected ? 'border-2 border-blue-400 bg-blue-900 bg-opacity-30' : 'border-stone-600 hover:border-amber-600'}`
                                  } ${slot ? 'cursor-grab active:cursor-grabbing' : ''}`
                                }`.trim()}

                              title={isReserved ? 'Reserved slot' : (slot ? slot.name : '')}
                            >
                              {isReserved ? (
                                <div className="text-stone-700 text-xs pointer-events-none">—</div>
                              ) : slot ? (
                                <>
                                  <img
                                    src={slot.sprite}
                                    alt={slot.name}
                                    className="w-10 h-10 pixelated pointer-events-none"
                                  />
                                  {displayMode && quantity > 1 && (
                                    <div className="absolute bottom-0 right-0 bg-stone-900 text-white text-xs px-1 rounded-tl pointer-events-none font-bold">
                                      {quantity}
                                    </div>
                                  )}
                                  {!displayMode && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        clearSlot(cell.id, slotIndex);
                                      }}
                                      className="absolute top-0 right-0 bg-red-600 text-white rounded-bl text-xs w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                      ×
                                    </button>
                                  )}
                                </>
                              ) : (
                                <div className="text-stone-600 text-xs pointer-events-none">+</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Add Cell Placeholder */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    addCell();
                  }}
                  className="bg-stone-900 border-2 border-dashed border-stone-600 rounded-lg p-4 cursor-pointer hover:border-amber-600 hover:bg-stone-800 transition-all flex items-center justify-center"
                  style={{ width: '464px', height: '281px' }}
                  title="Add new cell"
                >
                  <div className="text-stone-500 hover:text-amber-400 transition-colors">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>

              {cells.length === 0 && (
                <div className="text-center text-stone-500 mt-20">
                  <p className="text-xl mb-4">No cells yet</p>
                  <p>Click the + to create your first item set</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

