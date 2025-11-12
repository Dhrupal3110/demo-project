import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Minus } from 'lucide-react';
import Checkbox from '../common/Checkbox';

interface RegionCoverage {
  id: string;
  database: string;
  portfolio: string;
  peril: string;
  region: string;
  includeExclude: 'Include' | 'Exclude';
}

interface TreeNode {
  id: string;
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  expanded?: boolean;
  children?: TreeNode[];
}

interface ValidationErrors {
  portfolioRegionCoverage?: string;
}

const PortfolioRegionCoverageForm: React.FC<{
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  errors: ValidationErrors;
}> = ({ data, onChange, errors }) => {
  const [searchQuery, setSearchQuery] = useState(data.searchQuery || '');
  const [activeTab, setActiveTab] = useState(data.activeTab || 'EQ/FF');

  const initialPortfolios = data.portfolios || [
    {
      id: 'edm',
      label: 'EDM',
      checked: false,
      expanded: true,
      children: [
        {
          id: 'edm-1',
          label: 'EDM_RH_39823_AutoOwners_EQ_19',
          checked: true,
          expanded: false,
          children: [{ id: 'port1', label: 'Port 1', checked: true }],
        },
        {
          id: 'edm-2',
          label: 'EDM_RH_39823_AutoOwners_EQ_19',
          checked: false,
          expanded: false,
          children: [{ id: 'port7', label: 'Port 7', checked: false }],
        },
      ],
    },
    {
      id: 'rdm',
      label: 'RDM_RH_39823_AutoOwners_ALL_19',
      checked: true,
      expanded: false,
      children: [{ id: 'port20', label: 'Port 20', checked: true }],
    },
  ];

  const initialRegions = data.regions || [
    {
      id: 'worldwide',
      label: 'Worldwide',
      checked: true,
      indeterminate: false,
      expanded: true,
      children: [
        {
          id: 'us',
          label: 'United States',
          checked: true,
          indeterminate: true,
          expanded: true,
          children: [
            {
              id: 'california',
              label: 'California',
              checked: true,
              expanded: true,
              children: [
                {
                  id: 'pacific-nw',
                  label: 'Pacific North West',
                  checked: false,
                },
              ],
            },
          ],
        },
        {
          id: 'canada',
          label: 'Canada',
          checked: false,
          expanded: false,
        },
      ],
    },
  ];

  const initialCoverageData = data.coverageData || [
    {
      id: '1',
      database: 'EDM_RH_39823_AutoOwners_EQ_19',
      portfolio: 'Port 1',
      peril: 'EQ/FF',
      region: 'California',
      includeExclude: 'Include',
    },
    {
      id: '2',
      database: 'RDM_RH_39823_AutoOwners_ALL_19',
      portfolio: 'Port 20',
      peril: 'EQ/FF',
      region: 'California',
      includeExclude: 'Include',
    },
    {
      id: '3',
      database: 'EDM_RH_39823_AutoOwners_EQ_19',
      portfolio: 'Port 7',
      peril: 'IF',
      region: 'Germany',
      includeExclude: 'Exclude',
    },
  ];

  const [portfolios, setPortfolios] = useState<TreeNode[]>(initialPortfolios);
  const [regions, setRegions] = useState<TreeNode[]>(initialRegions);
  const [coverageData, setCoverageData] =
    useState<RegionCoverage[]>(initialCoverageData);

  // Update parent data whenever state changes
  useEffect(() => {
    onChange({
      searchQuery,
      activeTab,
      portfolios,
      regions,
      coverageData,
    });
  }, [searchQuery, activeTab, portfolios, regions, coverageData]);

  const toggleNode = (nodes: TreeNode[], nodeId: string): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, expanded: !node.expanded };
      }
      if (node.children) {
        return { ...node, children: toggleNode(node.children, nodeId) };
      }
      return node;
    });
  };

  const toggleCheckNode = (nodes: TreeNode[], nodeId: string): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        const newChecked = !node.checked;
        const updateChildren = (n: TreeNode): TreeNode => ({
          ...n,
          checked: newChecked,
          children: n.children?.map(updateChildren),
        });
        return updateChildren({
          ...node,
          checked: newChecked,
          indeterminate: false,
        });
      }
      if (node.children) {
        return { ...node, children: toggleCheckNode(node.children, nodeId) };
      }
      return node;
    });
  };

  const handleRemove = (id: string) => {
    setCoverageData(coverageData.filter((item) => item.id !== id));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Filter coverage data based on active tab
  const filteredCoverageData = coverageData.filter(
    (item) => item.peril === activeTab
  );

  const renderTreeNode = (
    node: TreeNode,
    level: number = 0,
    onToggle: (id: string) => void,
    onCheck: (id: string) => void
  ) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id}>
        <div
          className="flex items-center gap-1 py-1.5 hover:bg-(--color-secondary) px-2"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => onToggle(node.id)}
              className="w-4 h-4 flex items-center justify-center text-(--color-text-secondary) shrink-0"
            >
              {node.expanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ) : (
            <div className="w-4 shrink-0" />
          )}

          <Checkbox
            size="sm"
            checked={node.checked}
            indeterminate={node.indeterminate || false}
            onChange={() => onCheck(node.id)}
            aria-label={`Select ${node.label}`}
          />

          <span className="text-sm text-(--color-text) ml-1">{node.label}</span>
        </div>

        {hasChildren &&
          node.expanded &&
          node.children!.map((child) =>
            renderTreeNode(child, level + 1, onToggle, onCheck)
          )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-(--color-text)">
            6 – Set portfolio region coverage
          </h2>
          <button className="px-5 py-2 bg-(--color-primary) text-(--color-primary-text) rounded-lg text-sm font-medium hover:bg-(--color-primary-dark)">
            Add
          </button>
        </div>

        <div className="relative mb-6" style={{ maxWidth: '250px' }}>
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-text-muted)"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by EDM - Portfolio name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-(--color-border) rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div
        className="flex gap-0 mb-6 border border-(--color-border) bg-(--color-surface)"
        style={{ minHeight: '300px' }}
      >
        {/* Left Panel - Portfolios */}
        <div className="w-1/2 border-r border-(--color-border) flex flex-col">
          <div className="bg-(--color-surface) px-3 py-2 border-b border-(--color-border) shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTabChange('EQ/FF')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'EQ/FF'
                    ? 'bg-(--color-surface) border-2 border-(--color-border) text-(--color-text)'
                    : 'text-(--color-text-secondary) hover:bg-(--color-hover)'
                }`}
              >
                EQ/FF
              </button>
              <button
                onClick={() => handleTabChange('IF')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'IF'
                    ? 'bg-(--color-surface) border-2 border-(--color-border) text-(--color-text)'
                    : 'text-(--color-text-secondary) hover:bg-(--color-hover)'
                }`}
              >
                IF
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {portfolios.map((node) =>
              renderTreeNode(
                node,
                0,
                (id) => setPortfolios(toggleNode(portfolios, id)),
                (id) => setPortfolios(toggleCheckNode(portfolios, id))
              )
            )}
          </div>
        </div>

        {/* Right Panel - Regions */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-(--color-surface) px-3 py-2 border-b border-(--color-border) shrink-0">
            <h3 className="text-sm font-semibold text-(--color-text) py-1">
              Regional Coverage
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {regions.map((node) =>
              renderTreeNode(
                node,
                0,
                (id) => setRegions(toggleNode(regions, id)),
                (id) => setRegions(toggleCheckNode(regions, id))
              )
            )}
          </div>
        </div>
      </div>

      {/* Coverage Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-(--color-border)">
          <thead>
            <tr className="bg-(--color-hover)">
              <th className="border border-(--color-border) py-2.5 px-3 text-left font-semibold text-(--color-text-secondary) text-sm">
                Database
              </th>
              <th className="border border-(--color-border) py-2.5 px-3 text-left font-semibold text-(--color-text-secondary) text-sm">
                Portfolio
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
            {filteredCoverageData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border border-(--color-border) py-8 px-3 text-center text-sm text-(--color-text-muted)"
                >
                  No coverage data for {activeTab}
                </td>
              </tr>
            ) : (
              filteredCoverageData.map((item, index) => (
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
                    {item.portfolio}
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

      {errors.portfolioRegionCoverage && (
        <p className="text-(--color-error) text-sm mt-2">
          {errors.portfolioRegionCoverage}
        </p>
      )}
    </div>
  );
};

export default PortfolioRegionCoverageForm;
