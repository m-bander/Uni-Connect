const handlePlural = (count: number, singular: string, plural: string) => {
  if (count === 0) return `No ${plural}`;

  if (count === 1) return `1 ${singular}`;

  return `${count} ${plural}`;
};

export default handlePlural;
