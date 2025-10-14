export const FORM_TEMPLATES = {
  foundation_form: {
    title: 'Foundation Inspection Form',
    fields: [
      { id: 'inspector_name', sno: 1, label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspection_date', sno: 2, label: 'Inspection Date', type: 'date', required: true },
      {
        id: 'foundation_type', sno: 3, label: 'Foundation Type', type: 'select',
        options: ['Concrete Slab', 'Crawl Space', 'Basement', 'Pier & Beam'], required: true
      },
      {
        id: 'condition_rating', sno: 4, label: 'Overall Condition', type: 'radio',
        options: [
          { label: 'Excellent', value: 'Excellent' },
          { label: 'Good', value: 'Good' },
          { label: 'Fair', value: 'Fair' },
          { label: 'Poor', value: 'Poor' }
        ], required: true
      },
      { id: 'cracks_present', sno: 5, label: 'Cracks Present', type: 'checkbox', required: false },
      { id: 'water_damage', sno: 6, label: 'Water Damage', type: 'checkbox', required: false },
      { id: 'settlement_issues', sno: 7, label: 'Settlement Issues', type: 'checkbox', required: false },
      {
        id: 'ladder_inspection_groups',
        sno: 100,
        label: 'Answer Yes or No to all - Ladder Inspection',
        type: 'dynamic_group',
        groupFields: [
          { id: 'item', label: 'Item', type: 'text' },
          { id: 'no_rungs', label: 'No. Rungs', type: 'text' },
          { id: 'item_id', label: 'Item ID', type: 'text' },
          { id: 'rungs_loose_damaged', label: 'Rungs loose or damaged', type: 'text' },
          { id: 'stiles_loose_damaged', label: 'Stiles loose or damaged', type: 'text' },
          { id: 'feet_missing_damaged', label: 'Feet Missing or damaged', type: 'text' },
          { id: 'locks_braces_servicable', label: 'Locks/braces servicable', type: 'text' },
          { id: 'painted', label: 'Painted', type: 'text' },
          { id: 'pass_fail', label: 'PASS/FAIL', type: 'text' },
          { id: 'to_be_repaired', label: 'To be repaired', type: 'text' },
          { id: 'scrap', label: 'SCRAP', type: 'text' }
        ]
      },
      { id: 'notes', sno: 8, label: 'Additional Notes', type: 'textarea', required: false },
      { id: 'photos_taken', sno: 9, label: 'Number of Photos Taken', type: 'number', required: false },
      { id: 'inspectorName', label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspectionDate', label: 'Inspection Date', type: 'date', required: true },
      { id: 'sitePhoto', label: 'Site Photo', type: 'image', required: true },
      { id: 'signOff', label: 'Supervisor Signature', type: 'signature', required: true },
    ]
  },
  electrical_form: {
    title: 'Electrical Safety Check',
    fields: [
      { id: 'inspector_name', sno: 1, label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspection_date', sno: 2, label: 'Inspection Date', type: 'date', required: true },
      {
        id: 'panel_condition', sno: 3, label: 'Panel Condition', type: 'select',
        options: ['Good', 'Needs Attention', 'Poor'], required: true
      },
      {
        id: 'grounding_system', sno: 4, label: 'Grounding System', type: 'radio',
        options: [
          { label: 'Adequate', value: 'Adequate' },
          { label: 'Needs Improvement', value: 'Needs Improvement' },
          { label: 'Inadequate', value: 'Inadequate' }
        ], required: true
      },
      { id: 'gfci_outlets', sno: 5, label: 'GFCI Outlets Present', type: 'checkbox', required: false },
      { id: 'code_violations', sno: 6, label: 'Code Violations Found', type: 'checkbox', required: false },
      { id: 'voltage_reading', sno: 7, label: 'Voltage Reading (V)', type: 'number', required: false },
      { id: 'recommendations', sno: 8, label: 'Recommendations', type: 'textarea', required: false },
      {
        id: 'ladder_inspection_groups',
        sno: 100,
        label: 'Answer Yes or No to all - Ladder Inspection',
        type: 'dynamic_group',
        groupFields: [
          { id: 'item', label: 'Item', type: 'text' },
          { id: 'no_rungs', label: 'No. Rungs', type: 'text' },
          { id: 'item_id', label: 'Item ID', type: 'text' },
          { id: 'rungs_loose_damaged', label: 'Rungs loose or damaged', type: 'text' },
          { id: 'stiles_loose_damaged', label: 'Stiles loose or damaged', type: 'text' },
          { id: 'feet_missing_damaged', label: 'Feet Missing or damaged', type: 'text' },
          { id: 'locks_braces_servicable', label: 'Locks/braces servicable', type: 'text' },
          { id: 'painted', label: 'Painted', type: 'text' },
          { id: 'pass_fail', label: 'PASS/FAIL', type: 'text' },
          { id: 'to_be_repaired', label: 'To be repaired', type: 'text' },
          { id: 'scrap', label: 'SCRAP', type: 'text' }
        ]
      },
      { id: 'inspectorName', label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspectionDate', label: 'Inspection Date', type: 'date', required: true },
      { id: 'sitePhoto', label: 'Site Photo', type: 'image', required: true },
      { id: 'signOff', label: 'Supervisor Signature', type: 'signature', required: true },
    ]
  },
  annual_vehicle_form: {
    title: 'Annual Vehicle Inspection',
    fields: [
      { id: 'inspector_name', sno: 1, label: 'Inspector Name', type: 'text', required: true },
      { id: 'vehicle_vin', sno: 2, label: 'Vehicle VIN', type: 'text', required: true },
      { id: 'vehicle_year', sno: 3, label: 'Vehicle Year', type: 'number', required: true },
      { id: 'vehicle_make', sno: 4, label: 'Vehicle Make', type: 'text', required: true },
      { id: 'vehicle_model', sno: 5, label: 'Vehicle Model', type: 'text', required: true },
      { id: 'mileage', sno: 6, label: 'Current Mileage', type: 'number', required: true },
      {
        id: 'brakes_condition', sno: 7, label: 'Brakes Condition', type: 'select',
        options: ['Excellent', 'Good', 'Fair', 'Poor'], required: true
      },
      {
        id: 'tires_condition', sno: 8, label: 'Tires Condition', type: 'radio',
        options: [
          { label: 'New', value: 'New' },
          { label: 'Good', value: 'Good' },
          { label: 'Worn', value: 'Worn' },
          { label: 'Replace Soon', value: 'Replace Soon' }
        ], required: true
      },
      { id: 'lights_working', sno: 9, label: 'All Lights Working', type: 'checkbox', required: false },
      { id: 'emissions_pass', sno: 10, label: 'Emissions Test Pass', type: 'checkbox', required: false },
      { id: 'safety_issues', sno: 11, label: 'Safety Issues Found', type: 'textarea', required: false },
      {
        id: 'ladder_inspection_groups',
        sno: 100,
        label: 'Answer Yes or No to all - Ladder Inspection',
        type: 'dynamic_group',
        groupFields: [
          { id: 'item', label: 'Item', type: 'text' },
          { id: 'no_rungs', label: 'No. Rungs', type: 'text' },
          { id: 'item_id', label: 'Item ID', type: 'text' },
          { id: 'rungs_loose_damaged', label: 'Rungs loose or damaged', type: 'text' },
          { id: 'stiles_loose_damaged', label: 'Stiles loose or damaged', type: 'text' },
          { id: 'feet_missing_damaged', label: 'Feet Missing or damaged', type: 'text' },
          { id: 'locks_braces_servicable', label: 'Locks/braces servicable', type: 'text' },
          { id: 'painted', label: 'Painted', type: 'text' },
          { id: 'pass_fail', label: 'PASS/FAIL', type: 'text' },
          { id: 'to_be_repaired', label: 'To be repaired', type: 'text' },
          { id: 'scrap', label: 'SCRAP', type: 'text' }
        ]
      },
      { id: 'inspectorName', label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspectionDate', label: 'Inspection Date', type: 'date', required: true },
      { id: 'sitePhoto', label: 'Site Photo', type: 'image', required: true },
      { id: 'signOff', label: 'Supervisor Signature', type: 'signature', required: true },
    ]
  },
  fire_safety_form: {
    title: 'Fire Safety Audit',
    fields: [
      { id: 'inspector_name', sno: 1, label: 'Inspector Name', type: 'text', required: true },
      { id: 'facility_name', sno: 2, label: 'Facility Name', type: 'text', required: true },
      { id: 'inspection_date', sno: 3, label: 'Inspection Date', type: 'date', required: true },
      { id: 'fire_extinguishers', sno: 4, label: 'Fire Extinguishers Present', type: 'checkbox', required: false },
      { id: 'smoke_detectors', sno: 5, label: 'Smoke Detectors Functional', type: 'checkbox', required: false },
      { id: 'sprinkler_system', sno: 6, label: 'Sprinkler System Active', type: 'checkbox', required: false },
      { id: 'exit_signs', sno: 7, label: 'Exit Signs Visible', type: 'checkbox', required: false },
      { id: 'emergency_lighting', sno: 8, label: 'Emergency Lighting Working', type: 'checkbox', required: false },
      {
        id: 'fire_doors', sno: 9, label: 'Fire Doors Condition', type: 'select',
        options: ['Excellent', 'Good', 'Needs Repair', 'Non-Functional'], required: true
      },
      { id: 'evacuation_plan', sno: 10, label: 'Evacuation Plan Posted', type: 'checkbox', required: false },
      { id: 'hazards_identified', sno: 11, label: 'Fire Hazards Identified', type: 'textarea', required: false },
      {
        id: 'ladder_inspection_groups',
        sno: 100,
        label: 'Answer Yes or No to all - Ladder Inspection',
        type: 'dynamic_group',
        groupFields: [
          { id: 'item', label: 'Item', type: 'text' },
          { id: 'no_rungs', label: 'No. Rungs', type: 'text' },
          { id: 'item_id', label: 'Item ID', type: 'text' },
          { id: 'rungs_loose_damaged', label: 'Rungs loose or damaged', type: 'text' },
          { id: 'stiles_loose_damaged', label: 'Stiles loose or damaged', type: 'text' },
          { id: 'feet_missing_damaged', label: 'Feet Missing or damaged', type: 'text' },
          { id: 'locks_braces_servicable', label: 'Locks/braces servicable', type: 'text' },
          { id: 'painted', label: 'Painted', type: 'text' },
          { id: 'pass_fail', label: 'PASS/FAIL', type: 'text' },
          { id: 'to_be_repaired', label: 'To be repaired', type: 'text' },
          { id: 'scrap', label: 'SCRAP', type: 'text' }
        ]
      },
      { id: 'inspectorName', label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspectionDate', label: 'Inspection Date', type: 'date', required: true },
      { id: 'sitePhoto', label: 'Site Photo', type: 'image', required: true },
      { id: 'signOff', label: 'Supervisor Signature', type: 'signature', required: true },
    ]
  },
  plumbing_form: {
    title: 'Plumbing System Check',
    fields: [
      { id: 'inspector_name', sno: 1, label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspection_date', sno: 2, label: 'Inspection Date', type: 'date', required: true },
      { id: 'water_pressure', sno: 3, label: 'Water Pressure (PSI)', type: 'number', required: true },
      {
        id: 'pipe_condition', sno: 4, label: 'Pipe Condition', type: 'select',
        options: ['Excellent', 'Good', 'Fair', 'Poor'], required: true
      },
      { id: 'leaks_found', sno: 5, label: 'Leaks Found', type: 'checkbox', required: false },
      { id: 'hot_water_working', sno: 6, label: 'Hot Water System Working', type: 'checkbox', required: false },
      { id: 'drainage_issues', sno: 7, label: 'Drainage Issues', type: 'textarea', required: false },
      {
        id: 'ladder_inspection_groups',
        sno: 100,
        label: 'Answer Yes or No to all - Ladder Inspection',
        type: 'dynamic_group',
        groupFields: [
          { id: 'item', label: 'Item', type: 'text' },
          { id: 'no_rungs', label: 'No. Rungs', type: 'text' },
          { id: 'item_id', label: 'Item ID', type: 'text' },
          { id: 'rungs_loose_damaged', label: 'Rungs loose or damaged', type: 'text' },
          { id: 'stiles_loose_damaged', label: 'Stiles loose or damaged', type: 'text' },
          { id: 'feet_missing_damaged', label: 'Feet Missing or damaged', type: 'text' },
          { id: 'locks_braces_servicable', label: 'Locks/braces servicable', type: 'text' },
          { id: 'painted', label: 'Painted', type: 'text' },
          { id: 'pass_fail', label: 'PASS/FAIL', type: 'text' },
          { id: 'to_be_repaired', label: 'To be repaired', type: 'text' },
          { id: 'scrap', label: 'SCRAP', type: 'text' }
        ]
      },
      { id: 'inspectorName', label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspectionDate', label: 'Inspection Date', type: 'date', required: true },
      { id: 'sitePhoto', label: 'Site Photo', type: 'image', required: true },
      { id: 'signOff', label: 'Supervisor Signature', type: 'signature', required: true },
    ]
  },
  workplace_form: {
    title: 'Workplace Safety Assessment',
    fields: [
      { id: 'inspector_name', sno: 1, label: 'Inspector Name', type: 'text', required: true },
      { id: 'department', sno: 2, label: 'Department', type: 'text', required: true },
      { id: 'inspection_date', sno: 3, label: 'Inspection Date', type: 'date', required: true },
      { id: 'safety_equipment', sno: 4, label: 'Safety Equipment Available', type: 'checkbox', required: false },
      { id: 'emergency_exits', sno: 5, label: 'Emergency Exits Clear', type: 'checkbox', required: false },
      { id: 'first_aid_kit', sno: 6, label: 'First Aid Kit Available', type: 'checkbox', required: false },
      {
        id: 'safety_rating', sno: 7, label: 'Overall Safety Rating', type: 'radio',
        options: [
          { label: 'Excellent', value: 'Excellent' },
          { label: 'Good', value: 'Good' },
          { label: 'Satisfactory', value: 'Satisfactory' },
          { label: 'Needs Improvement', value: 'Needs Improvement' }
        ], required: true
      },
      { id: 'recommendations', sno: 8, label: 'Safety Recommendations', type: 'textarea', required: false },
      {
        id: 'ladder_inspection_groups',
        sno: 100,
        label: 'Answer Yes or No to all - Ladder Inspection',
        type: 'dynamic_group',
        groupFields: [
          { id: 'item', label: 'Item', type: 'text' },
          { id: 'no_rungs', label: 'No. Rungs', type: 'text' },
          { id: 'item_id', label: 'Item ID', type: 'text' },
          { id: 'rungs_loose_damaged', label: 'Rungs loose or damaged', type: 'text' },
          { id: 'stiles_loose_damaged', label: 'Stiles loose or damaged', type: 'text' },
          { id: 'feet_missing_damaged', label: 'Feet Missing or damaged', type: 'text' },
          { id: 'locks_braces_servicable', label: 'Locks/braces servicable', type: 'text' },
          { id: 'painted', label: 'Painted', type: 'text' },
          { id: 'pass_fail', label: 'PASS/FAIL', type: 'text' },
          { id: 'to_be_repaired', label: 'To be repaired', type: 'text' },
          { id: 'scrap', label: 'SCRAP', type: 'text' }
        ]
      },
      { id: 'inspectorName', label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspectionDate', label: 'Inspection Date', type: 'date', required: true },
      { id: 'sitePhoto', label: 'Site Photo', type: 'image', required: true },
      { id: 'signOff', label: 'Supervisor Signature', type: 'signature', required: true },
    ]
  },
};