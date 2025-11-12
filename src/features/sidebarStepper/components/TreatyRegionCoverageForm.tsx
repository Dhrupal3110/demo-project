// TreatyRegionCoverageForm.tsx
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Minus } from 'lucide-react';

import { Checkbox } from '@/components/common';
import { useTreatyRegionCoverageApi } from '@/features/sidebarStepper/hooks';

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

  const {
    treatiesEQFF: apiTreatiesEQFF,
    treatiesIF: apiTreatiesIF,
    regionsEQFF: apiRegionsEQFF,
    regionsIF: apiRegionsIF,
    selectedRegions: apiSelectedRegions,
    loading,
    error,
  } = useTreatyRegionCoverageApi();

  React.useEffect(() => {
    if (!loading && !data.treatiesEQFF) {
      onChange({
        ...data,
        treatiesEQFF: apiTreatiesEQFF,
        treatiesIF: apiTreatiesIF,
        regionsEQFF: apiRegionsEQFF,
        regionsIF: apiRegionsIF,
        selectedRegions: apiSelectedRegions,
      });
    }
  }, [
    loading,
    apiTreatiesEQFF,
    apiTreatiesIF,
    apiRegionsEQFF,
    apiRegionsIF,
    apiSelectedRegions,
  ]);

  const treatiesEQFF: TreatyItem[] = data.treatiesEQFF || apiTreatiesEQFF;
  const treatiesIF: TreatyItem[] = data.treatiesIF || apiTreatiesIF;
  const regionsEQFF: Region[] = data.regionsEQFF || apiRegionsEQFF;
  const regionsIF: Region[] = data.regionsIF || apiRegionsIF;
  const selectedRegions: SelectedRegion[] =
    data.selectedRegions || apiSelectedRegions;

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
          className="flex items-center gap-2 py-2 hover:bg-(--color-secondary)"
          style={{ paddingLeft: `${level * 24 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(region.id)}
              className="p-0.5 hover:bg-(--color-surface-muted) rounded"
            >
              {isExpanded ? (
                <ChevronDown
                  size={16}
                  className="text-(--color-text-secondary)"
                />
              ) : (
                <ChevronRight
                  size={16}
                  className="text-(--color-text-secondary)"
                />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}

          <div className="relative">
            <Checkbox
              size="sm"
              checked={region.checked}
              indeterminate={region.indeterminate || false}
              onChange={(e) => handleRegionCheck(region.id, e.target.checked)}
              aria-label={`Select region ${region.name}`}
            />
            {region.indeterminate && (
              <Minus
                size={12}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-(--color-primary) pointer-events-none"
                strokeWidth={3}
              />
            )}
          </div>

          <span className="text-sm text-(--color-text-secondary)">
            {region.name}
          </span>
        </div>
        {hasChildren &&
          isExpanded &&
          region.children!.map((child) => renderRegion(child, level + 1))}
      </div>
    );
  };

  const allTreatiesChecked = treaties.every((t) => t.checked);
  const someTreatiesChecked = treaties.some((t) => t.checked);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-(--color-text-secondary)">
          Loading treaty region coverage...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-(--color-error)">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-(--color-secondary) min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-(--color-text) mb-6">
          9 – Set treaty region coverage
        </h2>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative w-80">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-text-muted)"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by EDM - treaty name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-(--color-border) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-(--color-primary) text-(--color-primary-text) rounded-lg text-sm font-medium hover:bg-(--color-primary-dark) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-(--color-surface) border border-(--color-border) rounded-lg">
          <div className="p-4 border-b border-(--color-border) flex gap-2">
            <button
              onClick={() => setActivePeril('EQ/FF')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activePeril === 'EQ/FF'
                  ? 'bg-(--color-primary) text-(--color-primary-text)'
                  : 'bg-(--color-hover) text-(--color-text-secondary) hover:bg-(--color-surface-muted)'
              }`}
            >
              EQ/FF
            </button>
            <button
              onClick={() => setActivePeril('IF')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activePeril === 'IF'
                  ? 'bg-(--color-primary) text-(--color-primary-text)'
                  : 'bg-(--color-hover) text-(--color-text-secondary) hover:bg-(--color-surface-muted)'
              }`}
            >
              IF
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-(--color-border)">
                <div className="flex items-center gap-2">
                  <Checkbox
                    size="sm"
                    checked={allTreatiesChecked}
                    indeterminate={someTreatiesChecked && !allTreatiesChecked}
                    onChange={(e) => handleEDMCheck(e.target.checked)}
                    aria-label="Select all EDM treaties"
                  />
                  <span className="text-sm font-semibold text-(--color-text)">
                    EDM
                  </span>
                </div>
                <span className="text-sm font-semibold text-(--color-text)">
                  Treaty
                </span>
              </div>

              {filteredTreaties.map((treaty) => (
                <div
                  key={treaty.id}
                  className="flex items-center justify-between py-2 hover:bg-(--color-secondary) rounded"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      size="sm"
                      checked={treaty.checked}
                      onChange={() => handleTreatyCheck(treaty.id)}
                      aria-label={`Select treaty ${treaty.treaty}`}
                    />
                    <span className="text-sm text-(--color-text-secondary)">
                      {treaty.database}
                    </span>
                  </div>
                  <span className="text-sm text-(--color-text-secondary)">
                    {treaty.treaty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-(--color-surface) border border-(--color-border) rounded-lg">
          <div className="p-4 border-b border-(--color-border)">
            <h3 className="text-sm font-semibold text-(--color-text) py-1">
              Regional Coverage
            </h3>
          </div>
          <div className="p-4">
            {regions.map((region) => renderRegion(region))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-(--color-border)">
          <thead>
            <tr className="bg-(--color-hover)">
              <th className="border border-(--color-border) py-2.5 px-3 text-left font-semibold text-(--color-text-secondary) text-sm">
                Database
              </th>
              <th className="border border-(--color-border) py-2.5 px-3 text-left font-semibold text-(--color-text-secondary) text-sm">
                Treaty
              </th>
              <th className="border border-(--color-border) py-2.5 px-3 text-left font-semibold text-(--color-text-secondary) text-sm">
                Peril
              </th>
              <th className="border border-(--color-border) py-2.5 px-3 text-left font-semibold text-(--color-text-secondary) text-sm">
                Region
              </th>
              <th className="border border-(--color-border) py-2.5 px-3 text-left font-semibold text-(--color-text-secondary) text-sm">
                Include/Exclude
              </th>
              <th className="border border-(--color-border) py-2.5 px-3 text-left font-semibold text-(--color-text-secondary) text-sm">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedRegions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border border-(--color-border) py-8 px-3 text-center text-sm text-(--color-text-muted)"
                >
                  No coverage data
                </td>
              </tr>
            ) : (
              selectedRegions.map((item, index) => (
                <tr
                  key={item.id}
                  className={
                    index % 2 === 0
                      ? 'bg-(--color-surface)'
                      : 'bg-(--color-secondary)'
                  }
                >
                  <td className="border border-(--color-border) py-2.5 px-3 text-sm text-(--color-text)">
                    {item.database}
                  </td>
                  <td className="border border-(--color-border) py-2.5 px-3 text-sm text-(--color-text)">
                    {item.treaty}
                  </td>
                  <td className="border border-(--color-border) py-2.5 px-3 text-sm text-(--color-text)">
                    {item.peril}
                  </td>
                  <td className="border border-(--color-border) py-2.5 px-3 text-sm text-(--color-text)">
                    {item.region}
                  </td>
                  <td className="border border-(--color-border) py-2.5 px-3 text-sm text-(--color-text)">
                    {item.includeExclude}
                  </td>
                  <td className="border border-(--color-border) py-2.5 px-3 text-center">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="w-6 h-6 bg-(--color-primary) text-(--color-primary-text) rounded-full flex items-center justify-center hover:bg-(--color-primary-dark) mx-auto"
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
        <p className="text-(--color-error) text-sm mt-2">
          {errors.selectedRegions}
        </p>
      )}
    </div>
  );
};

export default TreatyRegionCoverageForm;
