export function decideAreaFromRubro(rubro: string) {
  const r = rubro.toUpperCase();

  if (r.includes('BEBIDA') || r.includes('CAFETERIA')) {
    return 'bar';
  }

  if (
    r.includes('PASTELERIA') ||
    r.includes('POSTRE') ||
    r.includes('COMIDA')
  ) {
    return 'kitchen';
  }

  return 'kitchen';
}
