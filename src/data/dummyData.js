export const INSPECTION_CATEGORIES = [
  { id: 1, name: 'Building Inspection', value: 'building' },
  { id: 2, name: 'Vehicle Inspection', value: 'vehicle' },
  { id: 3, name: 'Safety Inspection', value: 'safety' },
  { id: 4, name: 'Quality Inspection', value: 'quality' },
];

export const INSPECTION_TYPES = {
  building: [
    { id: 1, name: 'Structural Assessment', value: 'structural' },
    { id: 2, name: 'Electrical Systems', value: 'electrical' },
    { id: 3, name: 'Plumbing Systems', value: 'plumbing' },
    { id: 4, name: 'HVAC Systems', value: 'hvac' },
  ],
  vehicle: [
    { id: 1, name: 'Annual Vehicle Inspection', value: 'annual' },
    { id: 2, name: 'Pre-Purchase Inspection', value: 'purchase' },
    { id: 3, name: 'Accident Damage Assessment', value: 'damage' },
  ],
  safety: [
    { id: 1, name: 'Fire Safety Inspection', value: 'fire' },
    { id: 2, name: 'Workplace Safety Audit', value: 'workplace' },
    { id: 3, name: 'Equipment Safety Check', value: 'equipment' },
  ],
  quality: [
    { id: 1, name: 'Product Quality Control', value: 'product' },
    { id: 2, name: 'Manufacturing QA', value: 'manufacturing' },
    { id: 3, name: 'Service Quality Assessment', value: 'service' },
  ],
};

export const FORMS = {
  structural: [
    { id: 1, name: 'Foundation Inspection Form', formId: 'foundation_form' },
    { id: 2, name: 'Wall Structure Assessment', formId: 'wall_form' },
  ],
  electrical: [
    { id: 1, name: 'Electrical Safety Check', formId: 'electrical_form' },
    { id: 2, name: 'Wiring Inspection', formId: 'wiring_form' },
  ],
  annual: [
    { id: 1, name: 'Annual Vehicle Checklist', formId: 'annual_vehicle_form' },
  ],
  fire: [
    { id: 1, name: 'Fire Safety Audit', formId: 'fire_safety_form' },
  ],
  plumbing: [
    { id: 1, name: 'Plumbing System Check', formId: 'plumbing_form' },
  ],
  workplace: [
    { id: 1, name: 'Workplace Safety Assessment', formId: 'workplace_form' },
  ],
};

// ================================
// src/data/formTemplates.js
// ================================
export const FORM_TEMPLATES = {
  foundation_form: {
    title: 'Foundation Inspection Form',
    fields: [
      { id: 'inspector_name', label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspection_date', label: 'Inspection Date', type: 'date', required: true },
      { id: 'foundation_type', label: 'Foundation Type', type: 'select', 
        options: ['Concrete Slab', 'Crawl Space', 'Basement', 'Pier & Beam'], required: true },
      { id: 'condition_rating', label: 'Overall Condition', type: 'radio', 
        options: ['Excellent', 'Good', 'Fair', 'Poor'], required: true },
      { id: 'cracks_present', label: 'Cracks Present', type: 'checkbox', required: false },
      { id: 'water_damage', label: 'Water Damage', type: 'checkbox', required: false },
      { id: 'settlement_issues', label: 'Settlement Issues', type: 'checkbox', required: false },
      { id: 'notes', label: 'Additional Notes', type: 'textarea', required: false },
      { id: 'photos_taken', label: 'Number of Photos Taken', type: 'number', required: false },
    ]
  },
  electrical_form: {
    title: 'Electrical Safety Check',
    fields: [
      { id: 'inspector_name', label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspection_date', label: 'Inspection Date', type: 'date', required: true },
      { id: 'panel_condition', label: 'Panel Condition', type: 'select', 
        options: ['Good', 'Needs Attention', 'Poor'], required: true },
      { id: 'grounding_system', label: 'Grounding System', type: 'radio', 
        options: ['Adequate', 'Needs Improvement', 'Inadequate'], required: true },
      { id: 'gfci_outlets', label: 'GFCI Outlets Present', type: 'checkbox', required: false },
      { id: 'code_violations', label: 'Code Violations Found', type: 'checkbox', required: false },
      { id: 'voltage_reading', label: 'Voltage Reading (V)', type: 'number', required: false },
      { id: 'recommendations', label: 'Recommendations', type: 'textarea', required: false },
    ]
  },
  annual_vehicle_form: {
    title: 'Annual Vehicle Inspection',
    fields: [
      { id: 'inspector_name', label: 'Inspector Name', type: 'text', required: true },
      { id: 'vehicle_vin', label: 'Vehicle VIN', type: 'text', required: true },
      { id: 'vehicle_year', label: 'Vehicle Year', type: 'number', required: true },
      { id: 'vehicle_make', label: 'Vehicle Make', type: 'text', required: true },
      { id: 'vehicle_model', label: 'Vehicle Model', type: 'text', required: true },
      { id: 'mileage', label: 'Current Mileage', type: 'number', required: true },
      { id: 'brakes_condition', label: 'Brakes Condition', type: 'select', 
        options: ['Excellent', 'Good', 'Fair', 'Poor'], required: true },
      { id: 'tires_condition', label: 'Tires Condition', type: 'radio', 
        options: ['New', 'Good', 'Worn', 'Replace Soon'], required: true },
      { id: 'lights_working', label: 'All Lights Working', type: 'checkbox', required: false },
      { id: 'emissions_pass', label: 'Emissions Test Pass', type: 'checkbox', required: false },
      { id: 'safety_issues', label: 'Safety Issues Found', type: 'textarea', required: false },
    ]
  },
  fire_safety_form: {
    title: 'Fire Safety Audit',
    fields: [
      { id: 'inspector_name', label: 'Inspector Name', type: 'text', required: true },
      { id: 'facility_name', label: 'Facility Name', type: 'text', required: true },
      { id: 'inspection_date', label: 'Inspection Date', type: 'date', required: true },
      { id: 'fire_extinguishers', label: 'Fire Extinguishers Present', type: 'checkbox', required: false },
      { id: 'smoke_detectors', label: 'Smoke Detectors Functional', type: 'checkbox', required: false },
      { id: 'sprinkler_system', label: 'Sprinkler System Active', type: 'checkbox', required: false },
      { id: 'exit_signs', label: 'Exit Signs Visible', type: 'checkbox', required: false },
      { id: 'emergency_lighting', label: 'Emergency Lighting Working', type: 'checkbox', required: false },
      { id: 'fire_doors', label: 'Fire Doors Condition', type: 'select', 
        options: ['Excellent', 'Good', 'Needs Repair', 'Non-Functional'], required: true },
      { id: 'evacuation_plan', label: 'Evacuation Plan Posted', type: 'checkbox', required: false },
      { id: 'hazards_identified', label: 'Fire Hazards Identified', type: 'textarea', required: false },
    ]
  },
  plumbing_form: {
    title: 'Plumbing System Check',
    fields: [
      { id: 'inspector_name', label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspection_date', label: 'Inspection Date', type: 'date', required: true },
      { id: 'water_pressure', label: 'Water Pressure (PSI)', type: 'number', required: true },
      { id: 'pipe_condition', label: 'Pipe Condition', type: 'select', 
        options: ['Excellent', 'Good', 'Fair', 'Poor'], required: true },
      { id: 'leaks_found', label: 'Leaks Found', type: 'checkbox', required: false },
      { id: 'hot_water_working', label: 'Hot Water System Working', type: 'checkbox', required: false },
      { id: 'drainage_issues', label: 'Drainage Issues', type: 'textarea', required: false },
    ]
  },
  workplace_form: {
    title: 'Workplace Safety Assessment',
    fields: [
      { id: 'inspector_name', label: 'Inspector Name', type: 'text', required: true },
      { id: 'department', label: 'Department', type: 'text', required: true },
      { id: 'inspection_date', label: 'Inspection Date', type: 'date', required: true },
      { id: 'safety_equipment', label: 'Safety Equipment Available', type: 'checkbox', required: false },
      { id: 'emergency_exits', label: 'Emergency Exits Clear', type: 'checkbox', required: false },
      { id: 'first_aid_kit', label: 'First Aid Kit Available', type: 'checkbox', required: false },
      { id: 'safety_rating', label: 'Overall Safety Rating', type: 'radio', 
        options: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'], required: true },
      { id: 'recommendations', label: 'Safety Recommendations', type: 'textarea', required: false },
    ]
  },
};