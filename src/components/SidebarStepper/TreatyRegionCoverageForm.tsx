import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Minus } from 'lucide-react';

interface Region {
  id: string;
  name: string;
  checked: boolean;
  indeterminate?: boolean;
  children?: Region[];
}

interface TreatyItem {
  id: string;
  database: string;
  treaty: string;
  checked: boolean;
}

interface SelectedRegion {
  id: string;
  database: string;
  treaty: string;
  peril: string;
  region: string;
  includeExclude: 'Include' | 'Exclude';
}

interface ValidationErrors {
  selectedRegions?: string;
}

const TreatyRegionCoverageForm: React.FC<{
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  errors: ValidationErrors;
}> = ({ data, onChange, errors }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePeril, setActivePeril] = useState<'EQ/FF' | 'IF'>('EQ/FF');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(
    new Set(['worldwide', 'us'])
  );

  // Get treaties for each peril
  const treatiesEQFF: TreatyItem[] = data.treatiesEQFF || [
    {
      id: '1',
      database: 'EDM_RH_39823_AutoOwners_EQ_19',
      treaty: 'Treaty 1',
      checked: true,
    },
    {
      id: '2',
      database: 'EDM_RH_39823_AutoOwners_EQ_19',
      treaty: 'Treaty 7',
      checked: false,
    },
    {
      id: '3',
      database: 'RDM_RH_39823_AutoOwners_ALL_19',
      treaty: 'Treaty 20',
      checked: true,
    },
  ];

  const treatiesIF: TreatyItem[] = data.treatiesIF || [
    {
      id: '4',
      database: 'EDM_RH_39823_AutoOwners_EQ_19',
      treaty: 'Treaty 7',
      checked: false,
    },
    {
      id: '5',
      database: 'ZH_116751_BPCS_HD_25_EDM',
      treaty: 'Treaty 15',
      checked: false,
    },
  ];

  // Get regions for each peril
  const regionsEQFF: Region[] = data.regionsEQFF || [
    {
      id: 'worldwide',
      name: 'Worldwide',
      checked: false,
      indeterminate: true,
      children: [
        {
          id: 'us',
          name: 'United States',
          checked: false,
          indeterminate: true,
          children: [
            { id: 'california', name: 'California', checked: true },
            { id: 'pnw', name: 'Pacific North West', checked: false },
          ],
        },
        {
          id: 'canada',
          name: 'Canada',
          checked: false,
          children: [],
        },
      ],
    },
  ];

  const regionsIF: Region[] = data.regionsIF || [
    {
      id: 'worldwide-if',
      name: 'Worldwide',
      checked: false,
      children: [
        {
          id: 'europe',
          name: 'Europe',
          checked: false,
          children: [
            { id: 'germany', name: 'Germany', checked: false },
            { id: 'france', name: 'France', checked: false },
          ],
        },
      ],
    },
  ];

  const selectedRegions: SelectedRegion[] = data.selectedRegions || [
    {
      id: '1',
      database: 'EDM_RH_39823_AutoOwners_EQ_19',
      treaty: 'Treaty 1',
      peril: 'EQ/FF',
      region: 'California',
      includeExclude: 'Include',
    },
    {
      id: '2',
      database: 'RDM_RH_39823_AutoOwners_ALL_19',
      treaty: 'Treaty 20',
      peril: 'EQ/FF',
      region: 'California',
      includeExclude: 'Include',
    },
    {
      id: '3',
      database: 'EDM_RH_39823_AutoOwners_EQ_19',
      treaty: 'Treaty 7',
      peril: 'IF',
      region: 'Germany',
      includeExclude: 'Exclude',
    },
  ];

  // Get current active data based on peril
  const treaties = activePeril === 'EQ/FF' ? treatiesEQFF : treatiesIF;
  const regions = activePeril === 'EQ/FF' ? regionsEQFF : regionsIF;

  const filteredTreaties = treaties.filter(
    (item) =>
      item.database.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.treaty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpanded = (regionId: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionId)) {
      newExpanded.delete(regionId);
    } else {
      newExpanded.add(regionId);
    }
    setExpandedRegions(newExpanded);
  };

  const updateRegionCheck = (
    regionList: Region[],
    targetId: string,
    checked: boolean
  ): Region[] => {
    return regionList.map((region) => {
      if (region.id === targetId) {
        const updatedRegion = { ...region, checked, indeterminate: false };
        if (region.children && region.children.length > 0) {
          updatedRegion.children = region.children.map((child) => ({
            ...child,
            checked,
            indeterminate: false,
            children: child.children
              ? child.children.map((gc) => ({
                  ...gc,
                  checked,
                  indeterminate: false,
                }))
              : undefined,
          }));
        }
        return updatedRegion;
      }
      if (region.children && region.children.length > 0) {
        const updatedChildren = updateRegionCheck(
          region.children,
          targetId,
          checked
        );
        const allChecked = updatedChildren.every((c) => c.checked);
        const someChecked = updatedChildren.some(
          (c) => c.checked || c.indeterminate
        );
        return {
          ...region,
          children: updatedChildren,
          checked: allChecked,
          indeterminate: !allChecked && someChecked,
        };
      }
      return region;
    });
  };

  const handleRegionCheck = (regionId: string, checked: boolean) => {
    const updatedRegions = updateRegionCheck(regions, regionId, checked);
    const key = activePeril === 'EQ/FF' ? 'regionsEQFF' : 'regionsIF';
    onChange({ ...data, [key]: updatedRegions });
  };

  const handleTreatyCheck = (treatyId: string) => {
    const updatedTreaties = treaties.map((t) =>
      t.id === treatyId ? { ...t, checked: !t.checked } : t
    );
    const key = activePeril === 'EQ/FF' ? 'treatiesEQFF' : 'treatiesIF';
    onChange({ ...data, [key]: updatedTreaties });
  };

  const handleEDMCheck = (checked: boolean) => {
    const updatedTreaties = treaties.map((t) => ({ ...t, checked }));
    const key = activePeril === 'EQ/FF' ? 'treatiesEQFF' : 'treatiesIF';
    onChange({ ...data, [key]: updatedTreaties });
  };

  const handleAdd = () => {
    const checkedTreaties = treaties.filter((t) => t.checked);
    const checkedRegionIds: string[] = [];

    const collectCheckedRegions = (regionList: Region[]) => {
      regionList.forEach((region) => {
        if (
          region.checked &&
          (!region.children || region.children.length === 0)
        ) {
          checkedRegionIds.push(region.name);
        }
        if (region.children) {
          collectCheckedRegions(region.children);
        }
      });
    };

    collectCheckedRegions(regions);

    const newSelections: SelectedRegion[] = [];
    checkedTreaties.forEach((treaty) => {
      checkedRegionIds.forEach((regionName) => {
        newSelections.push({
          id: `${Date.now()}-${Math.random()}`,
          database: treaty.database,
          treaty: treaty.treaty,
          peril: activePeril,
          region: regionName,
          includeExclude: 'Include',
        });
      });
    });

    if (newSelections.length > 0) {
      onChange({
        ...data,
        selectedRegions: [...selectedRegions, ...newSelections],
      });
    }
  };

  const handleRemove = (id: string) => {
    const updatedSelectedRegions = selectedRegions.filter((r) => r.id !== id);
    onChange({ ...data, selectedRegions: updatedSelectedRegions });
  };

  const renderRegion = (region: Region, level: number = 0) => {
    const isExpanded = expandedRegions.has(region.id);
    const hasChildren = region.children && region.children.length > 0;

    return (
      <div key={region.id}>
        <div
          className="flex items-center gap-2 py-2 hover:bg-gray-50"
          style={{ paddingLeft: `${level * 24 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(region.id)}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-600" />
              ) : (
                <ChevronRight size={16} className="text-gray-600" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}

          <div className="relative">
            <input
              type="checkbox"
              checked={region.checked}
              ref={(el) => {
                if (el) el.indeterminate = region.indeterminate || false;
              }}
              onChange={(e) => handleRegionCheck(region.id, e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-gray-300 cursor-pointer"
            />
            {region.indeterminate && (
              <Minus
                size={12}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                strokeWidth={3}
              />
            )}
          </div>

          <span className="text-sm text-gray-700">{region.name}</span>
        </div>
        {hasChildren &&
          isExpanded &&
          region.children!.map((child) => renderRegion(child, level + 1))}
      </div>
    );
  };

  const allTreatiesChecked = treaties.every((t) => t.checked);
  const someTreatiesChecked = treaties.some((t) => t.checked);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          9 – Set treaty region coverage
        </h2>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative w-80">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by EDM - treaty name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Left Panel - Treaties */}
        <div className="bg-white border border-gray-300 rounded-lg">
          <div className="p-4 border-b border-gray-300 flex gap-2">
            <button
              onClick={() => setActivePeril('EQ/FF')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activePeril === 'EQ/FF'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              EQ/FF
            </button>
            <button
              onClick={() => setActivePeril('IF')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activePeril === 'IF'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              IF
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allTreatiesChecked}
                    ref={(el) => {
                      if (el)
                        el.indeterminate =
                          someTreatiesChecked && !allTreatiesChecked;
                    }}
                    onChange={(e) => handleEDMCheck(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    EDM
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Treaty
                </span>
              </div>

              {filteredTreaties.map((treaty) => (
                <div
                  key={treaty.id}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={treaty.checked}
                      onChange={() => handleTreatyCheck(treaty.id)}
                      className="w-4 h-4 text-emerald-600 rounded border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">
                      {treaty.database}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{treaty.treaty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Regions */}
        <div className="bg-white border border-gray-300 rounded-lg">
          <div className="p-4 border-b border-gray-300">
            <h3 className="text-sm font-semibold text-gray-900 py-1">
              Regional Coverage
            </h3>
          </div>
          <div className="p-4">
            {regions.map((region) => renderRegion(region))}
          </div>
        </div>
      </div>

      {/* Selected Regions Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 py-2.5 px-3 text-left font-semibold text-gray-700 text-sm">
                Database
              </th>
              <th className="border border-gray-300 py-2.5 px-3 text-left font-semibold text-gray-700 text-sm">
                Treaty
              </th>
              <th className="border border-gray-300 py-2.5 px-3 text-left font-semibold text-gray-700 text-sm">
                Peril
              </th>
              <th className="border border-gray-300 py-2.5 px-3 text-left font-semibold text-gray-700 text-sm">
                Region
              </th>
              <th className="border border-gray-300 py-2.5 px-3 text-left font-semibold text-gray-700 text-sm">
                Include/Exclude
              </th>
              <th className="border border-gray-300 py-2.5 px-3 text-left font-semibold text-gray-700 text-sm">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedRegions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border border-gray-300 py-8 px-3 text-center text-sm text-gray-500"
                >
                  No coverage data
                </td>
              </tr>
            ) : (
              selectedRegions.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="border border-gray-300 py-2.5 px-3 text-sm text-gray-900">
                    {item.database}
                  </td>
                  <td className="border border-gray-300 py-2.5 px-3 text-sm text-gray-900">
                    {item.treaty}
                  </td>
                  <td className="border border-gray-300 py-2.5 px-3 text-sm text-gray-900">
                    {item.peril}
                  </td>
                  <td className="border border-gray-300 py-2.5 px-3 text-sm text-gray-900">
                    {item.region}
                  </td>
                  <td className="border border-gray-300 py-2.5 px-3 text-sm text-gray-900">
                    {item.includeExclude}
                  </td>
                  <td className="border border-gray-300 py-2.5 px-3 text-center">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 mx-auto"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {errors.selectedRegions && (
        <p className="text-red-500 text-sm mt-2">{errors.selectedRegions}</p>
      )}
    </div>
  );
};

export default TreatyRegionCoverageForm;
