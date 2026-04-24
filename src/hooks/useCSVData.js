import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export function useCSVData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ 
    totalTeams: 0, 
    totalStudents: 0,
    basicSciences: 0,
    engineering: 0 
  });

  useEffect(() => {
    fetch('/ngit_full_teams.csv')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load CSV');
        return res.text();
      })
      .then(csvText => {
        const result = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
        });

        const transformed = result.data
          .filter(row => row['Team No'] && row['Title'])
          .map(row => {
            const membersRaw = (row['Team Members'] || '').trim();
            const members = membersRaw
              .split(';')
              .map(m => m.trim())
              .filter(Boolean);

            const stream = (row['Stream'] || '').trim();
            const department = stream.toLowerCase().includes('engineering')
              ? 'Engineering'
              : 'Basic Sciences';

            return {
              teamNo: (row['Team No'] || '').trim(),
              title: (row['Title'] || '').trim(),
              department,
              stream,
              members,
              guide: (row['Guide'] || '').trim(),
            };
          });

        const totalStudents = transformed.reduce(
          (sum, t) => sum + t.members.length, 0
        );
        
        const basicSciences = transformed.filter(t => t.department === 'Basic Sciences').length;
        const engineering = transformed.filter(t => t.department === 'Engineering').length;

        setData(transformed);
        setStats({
          totalTeams: transformed.length,
          totalStudents,
          basicSciences,
          engineering,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('CSV parse error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, stats };
}
