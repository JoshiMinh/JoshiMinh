"use client";

import { useState } from 'react';

// Object templates for quick creation
const OBJECT_TEMPLATES = {
  'Earth-like': {
    name: 'New Earth-like Planet',
    type: 'rocky',
    size: 1.0,
    mass: 1.0,
    color: 0x4A90E2,
    description: 'Rocky planet with atmosphere'
  },
  'Gas Giant': {
    name: 'New Gas Giant',
    type: 'gas',
    size: 2.5,
    mass: 100.0,
    color: 0xDAA520,
    description: 'Massive gaseous planet'
  },
  'Ice Giant': {
    name: 'New Ice Giant',
    type: 'ice',
    size: 1.8,
    mass: 15.0,
    color: 0x4FD0E7,
    description: 'Cold outer planet'
  },
  'Rocky': {
    name: 'New Rocky Planet',
    type: 'rocky',
    size: 0.5,
    mass: 0.1,
    color: 0xCD5C5C,
    description: 'Small rocky body'
  },
  'Asteroid': {
    name: 'New Asteroid',
    type: 'asteroid',
    size: 0.1,
    mass: 0.001,
    color: 0x8B8680,
    description: 'Small asteroid'
  },
  'Star': {
    name: 'New Star',
    type: 'star',
    size: 3.0,
    mass: 333000,
    color: 0xFFDD00,
    description: 'Massive luminous sphere'
  }
};

export function ObjectCreatorPanel({ onCreateObject, onClose, creationMode, onToggleCreationMode }) {
  const [objectName, setObjectName] = useState('New Object');
  const [objectSize, setObjectSize] = useState(1.0);
  const [objectMass, setObjectMass] = useState(1.0);
  const [objectColor, setObjectColor] = useState('#4A90E2');
  const [objectType, setObjectType] = useState('rocky');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleTemplateSelect = (templateName) => {
    const template = OBJECT_TEMPLATES[templateName];
    setObjectName(template.name);
    setObjectSize(template.size);
    setObjectMass(template.mass);
    setObjectColor('#' + template.color.toString(16).padStart(6, '0'));
    setObjectType(template.type);
    setSelectedTemplate(templateName);
  };

  const handleCreate = () => {
    const newObject = {
      name: objectName,
      size: objectSize,
      mass: objectMass,
      color: parseInt(objectColor.replace('#', ''), 16),
      type: objectType,
      speed: 0,
      distance: 0,
      rotationSpeed: 0.01,
      axialTilt: 0,
      eccentricity: 0,
      info: `Custom ${objectType} object`,
      isCustom: true
    };
    onCreateObject(newObject);
  };

  return (
    <div style={{
      position: "absolute",
      top: 80,
      right: 20,
      background: "rgba(0, 0, 0, 0.9)",
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      fontSize: "13px",
      width: "320px",
      maxHeight: "calc(100vh - 100px)",
      overflowY: "auto",
      zIndex: 100,
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "16px" 
      }}>
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
          🪐 Create Object
        </div>
        <button 
          onClick={onClose}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "6px",
            color: "white",
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          ✕
        </button>
      </div>

      {/* Template Selection */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ marginBottom: "8px", opacity: 0.8 }}>Templates:</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {Object.keys(OBJECT_TEMPLATES).map(templateName => (
            <button
              key={templateName}
              onClick={() => handleTemplateSelect(templateName)}
              style={{
                background: selectedTemplate === templateName 
                  ? "rgba(74, 144, 226, 0.3)" 
                  : "rgba(255, 255, 255, 0.1)",
                border: selectedTemplate === templateName
                  ? "1px solid rgba(74, 144, 226, 0.8)"
                  : "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                color: "white",
                padding: "8px",
                cursor: "pointer",
                fontSize: "12px",
                transition: "all 0.2s"
              }}
            >
              {templateName}
            </button>
          ))}
        </div>
      </div>

      {/* Object Properties */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "6px", opacity: 0.8 }}>
          Name:
        </label>
        <input
          type="text"
          value={objectName}
          onChange={(e) => setObjectName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "6px",
            color: "white",
            fontSize: "13px"
          }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "6px", opacity: 0.8 }}>
          Size: {objectSize.toFixed(2)}x Earth
        </label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={objectSize}
          onChange={(e) => setObjectSize(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "6px", opacity: 0.8 }}>
          Mass: {objectMass.toFixed(2)}x Earth
        </label>
        <input
          type="range"
          min="0.001"
          max="1000"
          step="0.1"
          value={objectMass}
          onChange={(e) => setObjectMass(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "6px", opacity: 0.8 }}>
          Color:
        </label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="color"
            value={objectColor}
            onChange={(e) => setObjectColor(e.target.value)}
            style={{
              width: "50px",
              height: "35px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          />
          <div style={{ 
            flex: 1, 
            padding: "8px",
            background: objectColor,
            borderRadius: "6px",
            textAlign: "center",
            fontSize: "12px",
            color: "white",
            textShadow: "0 0 3px black"
          }}>
            {objectColor}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", opacity: 0.8 }}>
          Type:
        </label>
        <select
          value={objectType}
          onChange={(e) => setObjectType(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "6px",
            color: "white",
            fontSize: "13px",
            cursor: "pointer"
          }}
        >
          <option value="rocky">Rocky</option>
          <option value="gas">Gas Giant</option>
          <option value="ice">Ice Giant</option>
          <option value="asteroid">Asteroid</option>
          <option value="star">Star</option>
        </select>
      </div>

      {/* Creation Mode Toggle */}
      <div style={{ 
        marginBottom: "16px", 
        padding: "12px",
        background: "rgba(74, 144, 226, 0.1)",
        borderRadius: "8px",
        border: "1px solid rgba(74, 144, 226, 0.3)"
      }}>
        <div style={{ marginBottom: "8px", fontWeight: "bold" }}>Placement Mode:</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => onToggleCreationMode('click')}
            style={{
              flex: 1,
              padding: "8px",
              background: creationMode === 'click' 
                ? "rgba(74, 144, 226, 0.5)" 
                : "rgba(255, 255, 255, 0.1)",
              border: creationMode === 'click'
                ? "1px solid rgba(74, 144, 226, 0.8)"
                : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Click to Place
          </button>
          <button
            onClick={() => onToggleCreationMode('drag')}
            style={{
              flex: 1,
              padding: "8px",
              background: creationMode === 'drag' 
                ? "rgba(74, 144, 226, 0.5)" 
                : "rgba(255, 255, 255, 0.1)",
              border: creationMode === 'drag'
                ? "1px solid rgba(74, 144, 226, 0.8)"
                : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Drag to Launch
          </button>
        </div>
        <div style={{ marginTop: "8px", fontSize: "11px", opacity: 0.7 }}>
          {creationMode === 'click' 
            ? "Click on the scene to place the object" 
            : "Click and drag to launch the object"}
        </div>
      </div>

      {/* Create Button */}
      <button
        onClick={handleCreate}
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(135deg, #4A90E2, #357ABD)",
          border: "none",
          borderRadius: "8px",
          color: "white",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
        onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
      >
        {creationMode === 'click' ? '✓ Ready to Place' : '🚀 Ready to Launch'}
      </button>

      <div style={{ 
        marginTop: "12px", 
        fontSize: "11px", 
        opacity: 0.6,
        textAlign: "center",
        lineHeight: "1.5"
      }}>
        {creationMode === 'click' 
          ? "After clicking this button, click anywhere in the 3D scene to place your object"
          : "After clicking this button, click and drag in the scene to set velocity"}
      </div>
    </div>
  );
}

export function ObjectEditorPanel({ selectedObject, onUpdateObject, onDeleteObject, onClose }) {
  const [mass, setMass] = useState(selectedObject.mass);
  const [size, setSize] = useState(selectedObject.size);
  const [color, setColor] = useState('#' + selectedObject.color.toString(16).padStart(6, '0'));
  const [name, setName] = useState(selectedObject.name);

  const handleUpdate = () => {
    const updatedObject = {
      ...selectedObject,
      name,
      mass,
      size,
      color: parseInt(color.replace('#', ''), 16)
    };
    onUpdateObject(updatedObject);
  };

  return (
    <div style={{
      position: "absolute",
      top: 80,
      right: 20,
      background: "rgba(0, 0, 0, 0.9)",
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      fontSize: "13px",
      width: "320px",
      maxHeight: "calc(100vh - 100px)",
      overflowY: "auto",
      zIndex: 100,
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "16px" 
      }}>
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
          ✏️ Edit Object
        </div>
        <button 
          onClick={onClose}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "6px",
            color: "white",
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          ✕
        </button>
      </div>

      {/* Object Name */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "6px", opacity: 0.8 }}>
          Name:
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "6px",
            color: "white",
            fontSize: "13px"
          }}
        />
      </div>

      {/* Mass Slider */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "6px", opacity: 0.8 }}>
          Mass: {mass.toFixed(2)}x Earth
        </label>
        <input
          type="range"
          min="0.001"
          max="1000"
          step="0.1"
          value={mass}
          onChange={(e) => setMass(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
          Affects gravitational pull
        </div>
      </div>

      {/* Size Slider */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "6px", opacity: 0.8 }}>
          Size: {size.toFixed(2)}x Earth
        </label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={size}
          onChange={(e) => setSize(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Color Picker */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", opacity: 0.8 }}>
          Color:
        </label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{
              width: "50px",
              height: "35px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          />
          <div style={{ 
            flex: 1, 
            padding: "8px",
            background: color,
            borderRadius: "6px",
            textAlign: "center",
            fontSize: "12px",
            color: "white",
            textShadow: "0 0 3px black"
          }}>
            {color}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={handleUpdate}
          style={{
            flex: 1,
            padding: "12px",
            background: "linear-gradient(135deg, #4A90E2, #357ABD)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          ✓ Update
        </button>
        <button
          onClick={() => onDeleteObject(selectedObject)}
          style={{
            padding: "12px 16px",
            background: "linear-gradient(135deg, #E24A4A, #BD3535)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          🗑️
        </button>
      </div>

      <div style={{ 
        marginTop: "12px", 
        fontSize: "11px", 
        opacity: 0.6,
        textAlign: "center"
      }}>
        Changes apply immediately to the simulation
      </div>
    </div>
  );
}
