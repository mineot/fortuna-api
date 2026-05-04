export function useMenu() {
  const checkActivation = (isActive: boolean): string => {
    const classes = ['btn', 'btn-sm'];

    if (isActive) {
      classes.push('btn-primary');
    } else {
      classes.push('btn-dark');
    }

    return classes.join(' ');
  };

  return { checkActivation };
}
