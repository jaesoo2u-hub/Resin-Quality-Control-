const fs = require('fs');
let code = fs.readFileSync('이력관리_ver.3.3.html', 'utf8');

// The git log indicates that the current head is ONLY the original commit.
// We must make our specific, narrow patches again since I reset it.
// The user strictly specified ONLY to fix the White Screen bug, which is caused by undefined arrays in old data.

// 1. entry.logs
code = code.replace(/entry\.logs\?/g, '(entry.logs || [])?');
code = code.replace(/entry\.logs\./g, '(entry.logs || []).');
code = code.replace(/\[\.\.\.entry\.logs\]/g, '[...(entry.logs || [])]');

// 2. log.images
code = code.replace(/log\.images\./g, '(log.images || []).');

// 3. activePoints mapping (which maps entry.points)
code = code.replace(/entry\.points\.map/g, '(entry.points || []).map');
code = code.replace(/entry\.points\.filter/g, '(entry.points || []).filter');
code = code.replace(/entry\.points\.forEach/g, '(entry.points || []).forEach');

// 4. auditLogs (if they exist in the original)
code = code.replace(/auditLogs\.filter/g, '(auditLogs || []).filter');

// 5. the renderDetails guard for currentPoint
const s = code.indexOf('const renderDetails = () => {');
const e = code.indexOf('const renderForm = () => (');
let detailsCode = code.substring(s, e);

const currentPointDecl = "const currentPoint = activePoints[activeTabIdx] || activePoints[0];";
const newCurrentPointDecl = currentPointDecl + `\n        if (!currentPoint) return <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center min-h-[400px]"><Icons.AlertTriangle/><h3 className="text-lg font-bold text-gray-800 mt-2">유효한 검사 항목이 없습니다</h3><p className="text-gray-500 mt-1">상단 설정에서 새로운 검사 항목 포인트를 추가해주세요.</p></div>;`;

detailsCode = detailsCode.replace(currentPointDecl, newCurrentPointDecl);
code = code.substring(0, s) + detailsCode + code.substring(e);

fs.writeFileSync('이력관리_ver.3.3.html', code);
