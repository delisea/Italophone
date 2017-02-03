#include <stdio.h>
#include <stdlib.h>

int main()
{
	char w[500];
	FILE* f = fopen("lesson1.txt", "r");
	FILE* fo = fopen("lesson1.json", "w+");
	int i = 0;
	int s = 0;
	int c = 0;
	fprintf(fo, "{ \"words\": [\n");
	while(!feof(f))
	{
		fscanf(f, "%c", w+i);
		if(w[i] == '\n')
		{
			w[i] = 0;
			if((s++)%2)			
				fprintf(fo, "\"Fr\": \"%s\"}", w);
			else
			{
				if(c)
					fprintf(fo, ",\n");
				c = 1;
				fprintf(fo, "{\"It\": \"%s\", ", w);
			}
			
			i = 0;
		}
		else
			i++;
	}
	fprintf(fo, "\n]}");
	fclose(f);
	fclose(fo);
	return 0;
}
