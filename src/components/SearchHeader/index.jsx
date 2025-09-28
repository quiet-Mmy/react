import React, { useState } from 'react';
import { Input, Button, Space, Select, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useTheme } from '../../hooks/useTheme';
import './index.css';

const { Search } = Input;
const { RangePicker } = DatePicker;

/**
 * 公共搜索头部组件
 * @param {Object} props - 组件属性
 * @param {Array} props.searchFields - 搜索字段配置
 * @param {Function} props.onSearch - 搜索回调
 * @param {Function} props.onReset - 重置回调
 * @param {Function} props.onAdd - 新增回调
 * @param {Object} props.extra - 额外操作按钮
 */
const SearchHeader = ({ 
    searchFields = [], 
    onSearch, 
    onReset, 
    onAdd,
    extra 
}) => {
    const { isDark } = useTheme();
    const [formData, setFormData] = useState({});

    const handleSearch = () => {
        onSearch?.(formData);
    };

    const handleReset = () => {
        setFormData({});
        onReset?.();
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const renderField = (field) => {
        const { key, label, type, options, placeholder } = field;
        
        switch (type) {
            case 'select':
                return (
                    <Select
                        key={key}
                        placeholder={placeholder || `请选择${label}`}
                        value={formData[key]}
                        onChange={(value) => handleFieldChange(key, value)}
                        style={{ width: 200 }}
                        allowClear
                    >
                        {options?.map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                );
            case 'date':
                return (
                    <DatePicker
                        key={key}
                        placeholder={placeholder || `请选择${label}`}
                        value={formData[key]}
                        onChange={(date) => handleFieldChange(key, date)}
                        style={{ width: 200 }}
                    />
                );
            case 'dateRange':
                return (
                    <RangePicker
                        key={key}
                        placeholder={[`开始${label}`, `结束${label}`]}
                        value={formData[key]}
                        onChange={(dates) => handleFieldChange(key, dates)}
                        style={{ width: 300 }}
                    />
                );
            default:
                return (
                    <Input
                        key={key}
                        placeholder={placeholder || `请输入${label}`}
                        value={formData[key]}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        style={{ width: 200 }}
                    />
                );
        }
    };

    return (
        <div className={`search-header ${isDark ? 'dark' : 'light'}`}>
            <div className="search-fields">
                {searchFields.map(field => (
                    <div key={field.key} className="search-field">
                        <label className="field-label">{field.label}:</label>
                        {renderField(field)}
                    </div>
                ))}
            </div>
            
            <div className="search-actions">
                <Space>
                    <Button 
                        type="primary" 
                        icon={<SearchOutlined />} 
                        onClick={handleSearch}
                    >
                        搜索
                    </Button>
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={handleReset}
                    >
                        重置
                    </Button>
                    {onAdd && (
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={onAdd}
                        >
                            新增
                        </Button>
                    )}
                    {extra}
                </Space>
            </div>
        </div>
    );
};

export default SearchHeader;
