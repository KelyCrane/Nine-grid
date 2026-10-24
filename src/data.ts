import sourceAlbums from './albums.json';
export type Photo = { src: string; alt: string; original: string };
export type Album = { id: string; title: string; category: string; description: string; images: Photo[] };
export const albums: Album[] = sourceAlbums;
export const asset = (path: string) => import.meta.env.BASE_URL + path;
export const artwork = asset('media/team-grayscale.png');
export const members = [
  { id: 'member-a', name: '成员资料待完善', location: '上排左侧', available: false, x: 0, y: 0, w: .5, h: .44 },
  { id: 'kong-ling', name: '孔玲', location: '上排右侧', available: true, x: .5, y: 0, w: .5, h: .44 },
  { id: 'member-c', name: '成员资料待完善', location: '下排左侧', available: false, x: 0, y: .44, w: 1/3, h: .56 },
  { id: 'member-d', name: '成员资料待完善', location: '下排中间', available: false, x: 1/3, y: .44, w: 1/3, h: .56 },
  { id: 'member-e', name: '成员资料待完善', location: '下排右侧', available: false, x: 2/3, y: .44, w: 1/3, h: .56 },
];
export const project = albums.find(a => a.id === 'chen-residence')!;
export const portraits = albums.find(a => a.id === 'portraits')!;
export const profileAlbums = albums.filter(a => a.category !== 'project');
export function parseRoute(hash: string) {
  const segments = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (segments[0] === 'people') return { page: 'person' as const, person: segments[1] || '', album: segments[2] === 'albums' ? segments[3] : undefined, project: segments[2] === 'projects' ? segments[3] : undefined };
  return { page: 'home' as const, section: ['team','work','services','contact'].includes(segments[0]) ? segments[0] : undefined, project: segments[0] === 'projects' ? segments[1] : undefined };
}
