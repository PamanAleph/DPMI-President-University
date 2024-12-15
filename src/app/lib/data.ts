export const greetings = {
  description: `Dear Alumni, President University July 2023 Graduates,
Greeting from President University!

We hope this message finds you well. As part of President University commitment to continuously improve the quality of education and better understand the outcomes of our programs, we are excited to invite you to participate in Alumni Tracer Study.

The Alumni Tracer Study is an important initiative that helps us gather valuable information about your post- graduation experiences and achievements. Your input will provide us with valuable insights that will contribute to enhancing our programs and services for now on and in the future.

The survey will take approximately 15 minutes to complete and your responses will remain confidential.

If you have any questions or require further assistance, please do not hesitate to contact Arya Ferdinan at WA 0822-9973-1571, Email: alumni@president.ac.id.

Thank you for your continued support and commitment to President University.

Sincerely, 
Matnur Syuryadi
Head of Alumni Relations Bureau 
Email: matnurs@president.ac.id 
WA: 0813 1991 9369
`,
};

export const multiSelectData = [
  {
    id: 1,
    options: {
      1: "Yes",
      2: "No",
    },
  },
  {
    id: 2,
    options: {
      1: "Option 1",
      2: "Option 2",
      3: "Option 3",
      4: "Option 4",
      5: "Option 5",
    },
  },
  {
    id: 3,
    options: {
      1: "Option 1",
      2: "Option 2",
      3: "Option 3",
      4: "Option 4",
      5: "Option 5",
    },
  },
];

export const major=[
  {
    major_id: 1,
    major_name: "Management",
  },
  {
    major_id: 2,
    major_name: "Business Administration",
  },
  {
    major_id: 3,
    major_name: "Accounting",
  },
  {
    major_id: 4,
    major_name: "MM Tech",
  },
]

export const formType = [
  {
    form_id: 1,
    form_type: "LAMEMBA",
    form_description: "MGT, BA, ACC",
  },
  {
    form_id: 2,
    form_type: "LAMEMBA",
    form_description: "MMTECH",
  },
  {
    form_id: 3,
    form_type: "LAMTEKNIK",
    form_description: "FACULTY OF ENGINEERING",
  },
  {
    form_id: 4,
    form_type: "LAMSAMA",
    form_description: "ACT",
  },
]

export const sectionData = [
  {
    section_id: 1,
    form_id: 3,
    section_name: "Bagian A: Daftar DTPS",
    section_description:
      "Tuliskan daftar DTPS pada tahun 2023; DTPS = dosen tetap President University ber-NIDN dan menjalankan fungsi pembinaan Prodi, seperti mengajar mata kuliah inti Prodi, melakukan pembimbingan Tugas Akhir, melakukan penelitian, atau pengabdian kepada masyarakat di Prodi",
    data_type: "section",
  },
  {
    section_id: 2,
    form_id: 3,
    section_name: "Bagian B: Capaian IKU",
    section_description: null,
    data_type: "section",
  },
  {
    section_id: 3,
    form_id: 2,
    section_name: "Bagian sdasd",
    section_description: null,
    data_type: "section",
  },
];

export const questionData = [
  {
    id: 1,
    section_id: 1,
    require: false,
    question:
      "Tuliskan nama dosen tetap President University ber-NIDN dan menjalankan fungsi pembinaan Prodi, seperti mengajar mata kuliah inti Prodi, melakukan pembimbingan Tugas Akhir, melakukan penelitian, atau pengabdian kepada masyarakat di Prodi",
    var_name: "q_001",
    answer_type: null,
    answer_id: null,
    data_type: "root_question",
  },
  {
    id: 2,
    section_id: 2,
    require: false,
    children_value: {
      id: [3, 4, 5, 6],
    },
    question: "Peningkatan Mutu Lulusan dan Kepuasan Pengguna Lulusan",
    var_name: "q_001",
    answer_type: null,
    answer_id: null,
    data_type: "root_question",
  },
  {
    id: 3,
    section_id: 2,
    require: true,
    children_value: null,
    question: "Rata-rata IPK lulusan (IPK)",
    var_name: "q_002",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 4,
    section_id: 2,
    require: true,
    children_value: null,
    question: "Rata-rata masa studi Lulusan (MS)",
    var_name: "q_002",
    answer_type: "text",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 5,
    section_id: 2,
    require: true,
    children_value: null,
    question: "Tingkat kepuasan pengguna lulusan",
    var_name: "q_002",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 6,
    section_id: 2,
    require: true,
    children_value: null,
    question:
      "Prosentase lulusan yang memenuhi kriteria kemampuan Bahasa Inggris yang ditetapkan Univ. Presiden",
    var_name: "q_002",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 7,
    section_id: 2,
    require: false,
    children_value: {
      id: [8, 9, 10],
    },
    question: "tesst 2",
    var_name: "q_003",
    answer_type: null,
    answer_id: 456,
    data_type: "root_question",
  },
  {
    id: 8,
    section_id: 2,
    require: true,
    children_value: null,
    question: "test2",
    var_name: "q_003",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 9,
    section_id: 2,
    require: true,
    children_value: null,
    question: "test2",
    var_name: "q_003",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 10,
    section_id: 2,
    require: true,
    children_value: null,
    question: "test2",
    var_name: "q_003",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 11,
    section_id: 1,
    require: false,
    question:
      "Tuliskan nama dosen tetap President University ber-NIDN dan menjalankan fungsi pembinaan Prodi, seperti mengajar mata kuliah inti Prodi, melakukan pembimbingan Tugas Akhir, melakukan penelitian, atau pengabdian kepada masyarakat di Prodi",
    var_name: "q_001",
    answer_type: null,
    answer_id: null,
    data_type: "root_question",
  },
  {
    id: 12,
    section_id: 2,
    require: false,
    children_value: {
      id: [13, 14, 15, 16],
    },
    question: "Peningkatan Mutu Lulusan dan Kepuasan Pengguna Lulusan",
    var_name: "q_001",
    answer_type: null,
    answer_id: null,
    data_type: "root_question",
  },
  {
    id: 13,
    section_id: 2,
    require: true,
    children_value: null,
    question: "Rata-rata IPK lulusan (IPK)",
    var_name: "q_002",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 14,
    section_id: 2,
    require: true,
    children_value: null,
    question: "Rata-rata masa studi Lulusan (MS)",
    var_name: "q_002",
    answer_type: "text",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 15,
    section_id: 2,
    require: true,
    children_value: null,
    question: "Tingkat kepuasan pengguna lulusan",
    var_name: "q_002",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 16,
    section_id: 2,
    require: true,
    children_value: null,
    question:
      "Prosentase lulusan yang memenuhi kriteria kemampuan Bahasa Inggris yang ditetapkan Univ. Presiden",
    var_name: "q_002",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 17,
    section_id: 2,
    require: false,
    children_value: {
      id: [18, 19, 20],
    },
    question: "tesst 2",
    var_name: "q_003",
    answer_type: null,
    answer_id: 456,
    data_type: "root_question",
  },
  {
    id: 18,
    section_id: 2,
    require: true,
    children_value: null,
    question: "test2",
    var_name: "q_003",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 19,
    section_id: 2,
    require: true,
    children_value: null,
    question: "test2",
    var_name: "q_003",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
  {
    id: 20,
    section_id: 2,
    require: true,
    children_value: null,
    question: "test2",
    var_name: "q_003",
    answer_type: "number",
    answer_id: 456,
    data_type: "sub_question",
  },
];
